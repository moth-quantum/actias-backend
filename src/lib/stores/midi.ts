import { get, writable, type Writable} from 'svelte/store';
import { WebMidi } from "webmidi";
import { axes } from './qubit';
import { instruments, instrument } from '$lib/stores/parameters';
import { presetKeys, activePreset } from '$lib/stores/presets';

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
    
function handleControlChange(e: any) {
    const { value, controller: {number} } = e;
    // axes
    if(number <= 3) {
        const axis = ['x', 'y', 'z'][number - 1]
        axes.update(a => a.map(a => a.key === axis ? {...a, value} : a))
    }
    // instrument
    else if(number === 4) {
        const name = instruments[Math.floor(value * instruments.length)];
        instrument.set(name)
    }
    // presets
    else if(number === 5) {
        const keys = get(presetKeys);
        const preset = keys[Math.floor(value * keys.length)];
        activePreset.set(preset);
    }
}
    
inputs.subscribe(inputs => {
    inputs.forEach(({name, active}) => active 
        ? addCCListeners(name)
        : removeCCListeners(name)
    )
})