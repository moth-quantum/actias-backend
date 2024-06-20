import { writable, derived, get } from 'svelte/store';
import { instrument, instrumentParameters, globalParameters, fxParameters, allParameters } from '$lib/stores/parameters';
import { envelopes } from '$lib/stores/envelopes';
import { connections } from '$lib/stores/patching';
import type { Envelope } from '$lib/types';
import { circuit } from '$lib/stores/circuit';
import { qubits, seconds } from '$lib/stores/qubits';
import { actions as midi } from '$lib/stores/midi';
import { projects } from '$lib/examples/projects';

export const presets = writable<{[key: string]: any}>(projects)

export const activePreset = writable('')

function initPresets() {
    if(typeof localStorage === 'undefined') return
    const stored = JSON.parse(localStorage.getItem('q.presets.project') || '{}');
    presets.update(presets => ({
        ...presets, 
        ...stored,
    }))
    activePreset.set('load')
}

initPresets();

presets.subscribe(presets => {
    if(typeof localStorage === 'undefined') return
    localStorage.setItem('q.presets.project', JSON.stringify(presets))
})

export const presetKeys = derived(
    presets,
    $presets => Object.keys($presets).sort((a, b) => a.localeCompare(b))
)

activePreset.subscribe(loadPreset)

export function loadPreset(key: string) {
    const preset = get(presets)[key]
    if(!preset) return;

    // update number of qubits
    qubits.update(qs => {
        return qs.map((q, i) => ({
            ...q,
            active: i < (preset.numQubits || 1),
            mounted: i < (preset.numQubits || 1) || q.mounted
        }))
    })
    
    // update envelope values
    envelopes.update((envelopes: Envelope[]) => {
        return preset.envelopes.reduce((arr: Envelope[], envelope: Envelope, i: number) => ([
            ...arr,
            {...envelopes[i], a: envelope.a, d: envelope.d, s: envelope.s, r: envelope.r}
        ]), []);
    });
    
    // update instrument
    instrument.set(preset.instrument);

    // update connections
    connections.set(preset.connections);

    // update preset
    preset.circuit && circuit.load(preset.circuit);

    // update midi
    preset.midi && midi.set(preset.midi);

    // update seconds
    preset.seconds && seconds.set(preset.seconds);

    [instrumentParameters, globalParameters, fxParameters]
        .forEach((store) => store.update((params) => {
            return params.map((param) => {
                const presetParam = preset.params.find((p) => p.key === param.key);
                if(!presetParam) return param;

                return {
                    ...param,
                    rangeA: presetParam.rangeA,
                    rangeB: presetParam.rangeB
                }
            })
        }))
}

export function savePreset(key: string) {
    if(typeof localStorage === 'undefined') return
    const stored = JSON.parse(localStorage.getItem('q.presets.project') || "{}");

    stored[key] = currentState();
    localStorage.setItem('q.presets.project', JSON.stringify(stored));

    presets.update(presets => ({...presets, ...stored}))
    activePreset.set(key)
}

export function deletePreset(key: string) {
    if(typeof localStorage === 'undefined') return
    const stored = JSON.parse(localStorage.getItem('q.presets.project') || "{}");
    delete stored[key];
    localStorage.setItem('q.presets.project', JSON.stringify(stored));
    presets.set(stored)
    activePreset.set('load')
}

export function editPreset(key: string) {
    if(typeof localStorage === 'undefined') return
    
    const previousName = get(activePreset);
    const stored = JSON.parse(localStorage.getItem('q.presets.project') || "{}");
    delete stored[previousName];
    stored[key] = currentState();
    localStorage.setItem('q.presets.project', JSON.stringify(stored));
    presets.set(stored)
    activePreset.set(key)
}

export function importPreset(name: string, data: any) {
    if(typeof localStorage === 'undefined') return
    const stored = JSON.parse(localStorage.getItem('q.presets.project') || "{}");
    const key = get(presetKeys).find(k => k === name) ? `${name} (imported)` : name;
    stored[key] = {
        instrument: data.instrument || get(instrument),
        envelopes: data.envelopes || get(envelopes),
        params: data.params || get(allParameters).map(({key, rangeA, rangeB}) => ({key, rangeA, rangeB})),
        connections: data.connections || get(connections),
        midi: data.midi || get(midi),
        circuit: data.circuit || circuit.save(),
        numQubits: data.numQubits || circuit.numQubits
    };
    localStorage.setItem('q.presets.project', JSON.stringify(stored));
    presets.set(stored)
    activePreset.set(key)
}

export function currentState() {
    return {
        instrument: get(instrument),
        envelopes: get(envelopes),
        params: get(allParameters).map(({key, rangeA, rangeB}) => ({key, rangeA, rangeB})),
        connections: get(connections),
        midi: get(midi),
        circuit: circuit.save(),
        numQubits: circuit.numQubits,
        seconds: get(seconds)
    }
}