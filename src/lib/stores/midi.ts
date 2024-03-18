import { get, writable, type Writable} from 'svelte/store';
import { WebMidi } from "webmidi";
import { axes } from './qubit';
import { instruments, instrument, randomise } from '$lib/stores/parameters';
import { randomiseConnections } from '$lib/stores/patching';
import { presetKeys, activePreset } from '$lib/stores/presets';
import { volume } from '$lib/stores/global';
import { updateEnvelopeValue } from '$lib/stores/envelopes';
import { measure } from '$lib/stores/qubit';

export const inputs: Writable<{name: string, active: boolean, channel: number}[]> = writable([]);
// maintain the order of active inputs
export const activeInputs: Writable<string[]> =writable([]);

inputs.subscribe(inputs => console.log(inputs))

export function activateInput(name: string) {
    activeInputs.set([
        ...get(activeInputs).filter(n => n !== name),
        name
    ]);

    inputs.update(inputList => {
        return inputList.map(input => ({
            ...input,
            active: input.name === name ? true : input.active
        }));
    });
}

export function deactivateInput(name: string) {
    activeInputs.set(get(activeInputs).filter(n => n !== name));

    inputs.update(inputList => {
        return inputList.map(input => ({
            ...input,
            active: input.name === name ? false : input.active
        }));
    });
}

WebMidi
    .enable()
    .then(() => {
        console.log("WebMidi enabled!")
        inputs.update(() => WebMidi.inputs.map(({name}) => ({name, active: false, channel: 1})));
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

const actions: {[key: number]: (value: number) => void} = {
    1: (value: number) => axes.update(a => a.map(a => a.key === 'z' ? {...a, value} : a)),
    2: (value: number) => axes.update(a => a.map(a => a.key === 'y' ? {...a, value} : a)),
    3: (value: number) => axes.update(a => a.map(a => a.key === 'x' ? {...a, value} : a)),
    4: (value: number) => instrument.set(instruments[Math.floor(value * instruments.length)].name),
    5: (value: number) => activePreset.set(get(presetKeys)[Math.floor(value * get(presetKeys).length)]),
    6: (value: number) => volume.set(value),
    7: (value: number) => updateEnvelopeValue(0, 'a', value),
    8: (value: number) => updateEnvelopeValue(0, 'd', value),
    9: (value: number) => updateEnvelopeValue(0, 's', value),
    10: (value: number) => updateEnvelopeValue(0, 'r', value),
    11: (value: number) => updateEnvelopeValue(1, 'a', value),
    12: (value: number) => updateEnvelopeValue(1, 'd', value),
    13: (value: number) => updateEnvelopeValue(1, 's', value),
    14: (value: number) => updateEnvelopeValue(1, 'r', value),
    15: (value: number) => value && measure(),
    16: (value: number) => value && randomise('inst'),
    17: (value: number) => value && randomise('global'),
    18: (value: number) => value && randomise('fx'),
    19: (value: number) => value && randomise('inst') && randomise('global') && randomise('fx'),
    20: (value: number) => value && randomiseConnections(),
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