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
    0: {label: 'Volume', id: 'volume'},
    1: {label: 'Env1 A', id: 'env-1-a'},
    2: {label: 'Env1 D', id: 'env-1-d' },
    3: {label: 'Env1 S', id: 'env-1-s' },
    4: {label: 'Env1 R', id: 'env-1-r' },
    5: {label: 'Env2 A', id: 'env-2-a' },
    6: {label: 'Env2 D', id: 'env-2-d' },
    7: {label: 'Env2 S', id: 'env-2-s' },
    8: {label: 'Env2 R', id: 'env-2-r' },
    9: {label: 'Measure', id: 'measure' },
    10: {label: 'Drone', id: 'drone' },
    11: {label: 'Q01 θ', id: 'qubit-0-2' },
    12: {label: 'Q01 φ', id: 'qubit-0-1' },
    13: {label: 'Q01 ψ', id: 'qubit-0-0' },
}
// const defaultActions = {
//     0: {label: 'Volume', action: (value: number) => volume.set(value)},
//     1: {label: 'Env1 A', action: (value: number) => updateEnvelopeValue(0, 'a', value)},
//     2: {label: 'Env1 D', action: (value: number) => updateEnvelopeValue(0, 'd', value)},
//     3: {label: 'Env1 S', action: (value: number) => updateEnvelopeValue(0, 's', value)},
//     4: {label: 'Env1 R', action: (value: number) => updateEnvelopeValue(0, 'r', value)},
//     5: {label: 'Env2 A', action: (value: number) => updateEnvelopeValue(1, 'a', value)},
//     6: {label: 'Env2 D', action: (value: number) => updateEnvelopeValue(1, 'd', value)},
//     7: {label: 'Env2 S', action: (value: number) => updateEnvelopeValue(1, 's', value)},
//     8: {label: 'Env2 R', action: (value: number) => updateEnvelopeValue(1, 'r', value)},
//     9: {label: 'Measure', action: (value: number) => value && measure()},
//     10: {label: 'Drone', action: (value: number) => drone.set(value > 0)},
//     11: {label: 'Q01 θ', action: (value: number) => axes[0].update(a => [a[0], a[1], value])},
//     12: {label: 'Q01 φ', action: (value: number) => axes[0].update(a => [a[0], value, a[2]])},
//     13: {label: 'Q01 ψ', action: (value: number) => axes[0].update(a => [value, a[1], a[2]])},
// }

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

function performQubitAction(qubit: number, axis: number, cc: number) {
    axes[qubit].update(a => {
        a[axis] = cc;
        return a;
    })
}

function performParamAction(group: string, param: string, minMax: string, cc: number) {
    const store = {inst: instrumentParameters, global: globalParameters, fx: fxParameters}[group];
    if(!store) return
    store.update((params: Parameter[]) => {
        return params.map(p => p.key === param 
            ? {...p, [minMax]: roundToFactor(cc * (p.max - p.min), p.step) + p.min} 
            : p
        )
    })
}

const performVolumeAction = (cc: number) => volume.set(cc);
const performEnvelopeAction = (env: number, param: string, cc: number) => updateEnvelopeValue(env, param, cc);
const performMeasureAction = (cc: number) => cc && measure();
const performDroneAction = (cc: number) => drone.set(cc > 0);

const actionFactory: {[key: string]: (...args: any) => string} = {
    qubit: (qubit: number, axis: number) => `Q${qubit.toString().padStart(2, '0')} ${['θ', 'φ', 'ψ'][+axis]}`,
    param: (param: string, minMax: string) => `${param} ${minMax}`,
    volume: () => 'Volume',
    env: (env: number, param: string) => `Env${env + 1} ${param}`,
    measure: () => 'Measure',
    drone: () => 'Drone'
}

function handleControlChange(e: any) {
    const { value, controller: { number } } = e;
    const isLearning = get(learn);
    const controlToLearn = get(learnControl);
    
    // Handle any new midi learn actions
    if(isLearning && controlToLearn) {
        const args = controlToLearn.split('-');
        ['qubit', 'param', 'volume', 'env', 'measure', 'drone'].includes(args[0]) && actions.update(a => ({
            ...a, 
            [number]: {
                id: controlToLearn, 
                label: actionFactory[args[0]](...args.slice(1))
            }
        }))
    }

    // Perform the action
    const [type, ...rest] = get(actions)[number]?.id.split('-') || [];
    type === 'qubit' && performQubitAction(+rest[0], +rest[1], value)
    type === 'param' && performParamAction(rest[0], rest[1], rest[2], value)
    type === 'volume' && performVolumeAction(value)
    type === 'env' && performEnvelopeAction(+rest[0], rest[1], value)
    type === 'measure' && performMeasureAction(value)
    type === 'drone' && performDroneAction(value)
}


export function resetActions() {
    actions.set(defaultActions);
}