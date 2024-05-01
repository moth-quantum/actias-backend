import { get, writable, type Writable} from 'svelte/store';
import { WebMidi } from "webmidi";
import { instruments, instrument, randomise } from '$lib/stores/parameters';
import { randomiseConnections } from '$lib/stores/patching';
import { presetKeys, activePreset } from '$lib/stores/presets-synths';
import { volume } from '$lib/stores/global';
import { updateEnvelopeValue } from '$lib/stores/envelopes';
import { measure, axes } from '$lib/stores/qubits';
import type { Action } from '$lib/types';

export const inputs: Writable<{name: string, active: boolean, channel: number}[]> = writable([]);
// maintain the order of active inputs
export const activeInputs: Writable<string[]> =writable([]);

export const learn = writable(false);
export const learnControl = writable('')

// Subscribe to inputs and activeInputs changes and save them in local storage
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
        if(typeof localStorage === 'undefined') return
        
        // sync with any saved active inputs
        const savedActiveInputs = localStorage.getItem('q.midi.activeInputs');
        savedActiveInputs && activeInputs.set(JSON.parse(savedActiveInputs));
        
        // sync with any saved inputs
        const savedInputs = localStorage.getItem('q.midi.inputs') 
            ? JSON.parse(localStorage.getItem('q.midi.inputs') || '')
            : false
        
        inputs.update(() => WebMidi.inputs.map(({name}) => ({
            name, 
            active: savedInputs ? savedInputs.find((input: any) => input.name === name)?.active : false, 
            channel: savedInputs ? savedInputs.find((input: any) => input.name === name)?.channel || 1 : 1
        })));

        // save inputs to local storage
        inputs.subscribe((newInputs) => {
            localStorage.setItem('q.midi.inputs', JSON.stringify(newInputs));
        });

        // save active inputs to local storage
        activeInputs.subscribe((newActiveInputs) => {
            localStorage.setItem('q.midi.activeInputs', JSON.stringify(newActiveInputs));
        });
    })

function addCCListeners(name: string, channel: number) {
    const input = WebMidi.getInputByName(name);
    if(input?.hasListener("controlchange", handleControlChange)) return
    input?.addListener("controlchange", handleControlChange, {channels: [channel]});
}

function removeCCListeners(name: string) {
    const input = WebMidi.getInputByName(name);
    input?.removeListener("controlchange", handleControlChange);
}

// TODO: default mapping for n qubits
export const actions: Writable<{[key: number]: Action}> = writable({
    0: {label: 'Q01 θ', action: (value: number) => axes[0].update(a => [a[0], a[1], value])},
    1: {label: 'Q01 φ', action: (value: number) => axes[0].update(a => [a[0], value, a[2]])},
    2: {label: 'Q01 ψ', action: (value: number) => axes[0].update(a => [value, a[1], a[2]])},
    3: {label: 'Instrument', action: (value: number) => instrument.set(instruments[Math.floor(value * instruments.length)].name)},
    4: {label: 'Preset', action: (value: number) => activePreset.set(get(presetKeys)[Math.floor(value * get(presetKeys).length)])},
    5: {label: 'Volume', action: (value: number) => volume.set(value)},
    6: {label: 'Env1 A', action: (value: number) => updateEnvelopeValue(0, 'a', value)},
    7: {label: 'Env1 D', action: (value: number) => updateEnvelopeValue(0, 'd', value)},
    8: {label: 'Env1 S', action: (value: number) => updateEnvelopeValue(0, 's', value)},
    9: {label: 'Env1 R', action: (value: number) => updateEnvelopeValue(0, 'r', value)},
    10: {label: 'Env2 A', action: (value: number) => updateEnvelopeValue(1, 'a', value)},
    11: {label: 'Env2 D', action: (value: number) => updateEnvelopeValue(1, 'd', value)},
    12: {label: 'Env2 S', action: (value: number) => updateEnvelopeValue(1, 's', value)},
    13: {label: 'Env2 R', action: (value: number) => updateEnvelopeValue(1, 'r', value)},
    14: {label: 'Measure', action: (value: number) => value && measure()},
    15: {label: '? Instrument', action: (value: number) => value && randomise('inst')},
    16: {label: '? Global', action: (value: number) => value && randomise('global')},
    17: {label: '? FX', action: (value: number) => value && randomise('fx')},
    18: {label: '? All', action: (value: number) => value && randomise('inst') && randomise('global') && randomise('fx')},
    19: {label: '? Connections', action: (value: number) => value && randomiseConnections()},
})
    
inputs.subscribe(inputs => {
    inputs.forEach(({name, active, channel}) => {
        // clear previous config
        removeCCListeners(name)
        // add a listener for that name and channel
        active && addCCListeners(name, channel)
    })
})

export const mapQubitToMidi = (qubit: number, axis: number, cc: number) => {
    const label = `Q${qubit.toString().padStart(2, '0')} ${['θ', 'φ', 'ψ'][axis]}`;
    actions.update(a =>({
        ...a,
        [cc]: {label, action: (value: number) => axes[qubit].update(a => {
            a[axis] = value;
            return a;
        })}
    
    }))
}

function handleControlChange(e: any) {
    // Handle any new midi learn actions
    const { value, controller: { number } } = e;
    const isLearning = get(learn);
    const controlToLearn = get(learnControl);

    if(isLearning && controlToLearn) {
        const args = controlToLearn.split('-');
        console.log(args)
        args[0] === 'qubit' && mapQubitToMidi(parseInt(args[1]), parseInt(args[2]), number)
    }

    // Perform the action
    get(actions)[number]?.action(value)
}