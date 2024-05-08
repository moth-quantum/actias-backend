import { writable, derived, get } from 'svelte/store';
import { instrument, instrumentParameters, globalParameters, fxParameters, allParameters } from '$lib/stores/parameters';
import { envelopes } from '$lib/stores/envelopes';
import { connections } from '$lib/stores/patching';
import type { Envelope, Preset } from '$lib/types';
import { circuit } from '$lib/stores/circuit';

export const presets = writable({} as {[key: string]: Preset | null})

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

    stored[key] = {
        instrument: get(instrument),
        envelopes: get(envelopes),
        params: get(allParameters).map(({key, rangeA, rangeB}) => ({key, rangeA, rangeB})),
        connections: get(connections),
        circuit: circuit.save()
    };
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
    const preset = stored[previousName];
    delete stored[previousName];
    stored[key] = {
        instrument: get(instrument),
        envelopes: get(envelopes),
        params: get(allParameters).map(({key, rangeA, rangeB}) => ({key, rangeA, rangeB})),
        connections: get(connections)
    };
    localStorage.setItem('q.presets.project', JSON.stringify(stored));
    presets.set(stored)
    activePreset.set(key)
}