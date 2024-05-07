import { get, writable, type Writable} from 'svelte/store';
import { WebMidi } from "webmidi";
import { instrumentParameters, globalParameters, fxParameters, drone } from '$lib/stores/parameters';
import { volume } from '$lib/stores/global';
import { updateEnvelopeValue } from '$lib/stores/envelopes';
import { measure, axes } from '$lib/stores/qubits';
import type { Action, Parameter } from '$lib/types';
import { roundToFactor } from '$lib/utils/utils';

export const inputs: Writable<{name: string, active: boolean, channel: number}[]> = writable([]);
// maintain the order of active inputs
export const activeInputs: Writable<string[]> =writable([]);

export const learn = writable(false);
export const learnControl = writable('')

const defaultActions = {
    0: {label: 'Volume', action: (value: number) => volume.set(value)},
    1: {label: 'Env1 A', action: (value: number) => updateEnvelopeValue(0, 'a', value)},
    2: {label: 'Env1 D', action: (value: number) => updateEnvelopeValue(0, 'd', value)},
    3: {label: 'Env1 S', action: (value: number) => updateEnvelopeValue(0, 's', value)},
    4: {label: 'Env1 R', action: (value: number) => updateEnvelopeValue(0, 'r', value)},
    5: {label: 'Env2 A', action: (value: number) => updateEnvelopeValue(1, 'a', value)},
    6: {label: 'Env2 D', action: (value: number) => updateEnvelopeValue(1, 'd', value)},
    7: {label: 'Env2 S', action: (value: number) => updateEnvelopeValue(1, 's', value)},
    8: {label: 'Env2 R', action: (value: number) => updateEnvelopeValue(1, 'r', value)},
    9: {label: 'Measure', action: (value: number) => value && measure()},
    10: {label: 'Drone', action: (value: number) => drone.set(value > 0)},
    11: {label: 'Q01 θ', action: (value: number) => axes[0].update(a => [a[0], a[1], value])},
    12: {label: 'Q01 φ', action: (value: number) => axes[0].update(a => [a[0], value, a[2]])},
    13: {label: 'Q01 ψ', action: (value: number) => axes[0].update(a => [value, a[1], a[2]])},
}

export const actions: Writable<{[key: number]: Action}> = writable(defaultActions);

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

        // // sync with any saved actions
        // const savedActions = localStorage.getItem('q.midi.actions')
        //     ? JSON.parse(localStorage.getItem('q.midi.actions') || '')
        //     : false
        
        // console.log(savedActions)
        // actions.update(() => savedActions || defaultActions)

        // save inputs to local storage
        inputs.subscribe((newInputs) => {
            localStorage.setItem('q.midi.inputs', JSON.stringify(newInputs));
        });

        // save active inputs to local storage
        activeInputs.subscribe((newActiveInputs) => {
            localStorage.setItem('q.midi.activeInputs', JSON.stringify(newActiveInputs));
        });

        // // save actions to local storage
        // actions.subscribe((newActions) => {
        //     localStorage.setItem('q.midi.actions', JSON.stringify(newActions));
        // });
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
    
inputs.subscribe(inputs => {
    inputs.forEach(({name, active, channel}) => {
        // clear previous config
        removeCCListeners(name)
        // add a listener for that name and channel
        active && addCCListeners(name, channel)
    })
})

function mapQubitToMidi(qubit: number, axis: number, cc: number) {
    const label = `Q${qubit.toString().padStart(2, '0')} ${['θ', 'φ', 'ψ'][axis]}`;
    actions.update(a =>({
        ...a,
        [cc]: {label, action: (value: number) => axes[qubit].update(a => {
            a[axis] = value;
            return a;
        })}
    
    }))
}

function mapParamToMidi(group: string, param: string, minMax: string, cc: number) {
    const store = {inst: instrumentParameters, global: globalParameters, fx: fxParameters}[group];
    if(!store) return
    const label = `${param} ${minMax}`;
    actions.update(a =>({
        ...a,
        [cc]: {label, action: (value: number) => store.update((params: Parameter[]) => {
            return params.map(p => {
                return p.key === param 
                    ? {
                        ...p, 
                        [minMax]: roundToFactor(value * (p.max - p.min), p.step) + p.min
                    } : p
            })
        })}
    }))
}

function mapVolumeToMidi(cc: number) {
    actions.update(a =>({
        ...a,
        [cc]: {label: 'Volume', action: (value: number) => volume.set(value)}
    }))
}

function mapEnvelopeToMidi(env: number, param: string, cc: number) {
    actions.update(a =>({
        ...a,
        [cc]: {label: `Env${env + 1} ${param}`, action: (value: number) => updateEnvelopeValue(env, param, value)}
    }))
}

function mapMeasureToMidi(cc: number) {
    actions.update(a =>({
        ...a,
        [cc]: {label: 'Measure', action: (value: number) => value && measure()}
    }))
}

function mapDroneToMidi(cc: number) {
    actions.update(a =>({
        ...a,
        [cc]: {label: 'Drone', action: (value: number) => drone.set(value > 0)}
    }))
}

function handleControlChange(e: any) {
    // Handle any new midi learn actions
    const { value, controller: { number } } = e;
    const isLearning = get(learn);
    const controlToLearn = get(learnControl);

    if(isLearning && controlToLearn) {
        const args = controlToLearn.split('-');
        args[0] === 'qubit' && mapQubitToMidi(parseInt(args[1]), parseInt(args[2]), number)
        args[0] === 'param' && mapParamToMidi(args[1], args[2], args[3], number)
        args[0] === 'volume' && mapVolumeToMidi(number)
        args[0] === 'env' && mapEnvelopeToMidi(parseInt(args[1]), args[2], number)
        args[0] === 'measure' && mapMeasureToMidi(number)
        args[0] === 'drone' && mapDroneToMidi(number)
    }

    // Perform the action
    get(actions)[number]?.action(value)
}


export function resetActions() {
    actions.set(defaultActions);
}