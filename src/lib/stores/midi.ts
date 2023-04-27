import { get, writable, type Writable} from 'svelte/store';
import { WebMidi } from "webmidi";
import { axes } from './qubit';
import { instruments, instrument } from '$lib/stores/parameters';
import { presetKeys, activePreset } from '$lib/stores/presets';
import { volume } from '$lib/stores/global';
import { envelopes } from '$lib/stores/envelopes';
import type { Envelope } from '$lib/types';

export const inputs: Writable<{name: string, active: boolean}[]> = writable([]);

WebMidi
    .enable()
    .then(() => {
        console.log("WebMidi enabled!")
        inputs.update(() => WebMidi.inputs.map(({name}) => ({name, active: true})));
    })

function addCCListeners(name: string) {
    const input = WebMidi.getInputByName(name);
    if(input?.hasListener("controlchange", handleControlChange)) return
    input?.addListener("controlchange", handleControlChange);
}

function removeCCListeners(name: string) {
    const input = WebMidi.getInputByName(name);
    input?.removeListener("controlchange", handleControlChange);
}

function updateEnvelope(i: number, key: string, value: number) {
    envelopes.update((envelopes: Envelope[]) => {
        envelopes[i][key] = value
        return envelopes
    })
}

const actions: {[key: number]: (value: number) => void} = {
    1: (value: number) => axes.update(a => a.map(a => a.key === 'z' ? {...a, value} : a)),
    2: (value: number) => axes.update(a => a.map(a => a.key === 'y' ? {...a, value} : a)),
    3: (value: number) => axes.update(a => a.map(a => a.key === 'x' ? {...a, value} : a)),
    4: (value: number) => instrument.set(instruments[Math.floor(value * instruments.length)]),
    5: (value: number) => activePreset.set(get(presetKeys)[Math.floor(value * get(presetKeys).length)]),
    6: (value: number) => volume.set(value),
    7: (value: number) => updateEnvelope(0, 'a', value),
    8: (value: number) => updateEnvelope(0, 'd', value),
    9: (value: number) => updateEnvelope(0, 's', value),
    10: (value: number) => updateEnvelope(0, 'r', value),
    11: (value: number) => updateEnvelope(1, 'a', value),
    12: (value: number) => updateEnvelope(1, 'd', value),
    13: (value: number) => updateEnvelope(1, 's', value),
    14: (value: number) => updateEnvelope(1, 'r', value),
}
    
function handleControlChange(e: any) {
    const { value, controller: {number} } = e;
    actions[number](value)
}
    
inputs.subscribe(inputs => {
    inputs.forEach(({name, active}) => active 
        ? addCCListeners(name)
        : removeCCListeners(name)
    )
})