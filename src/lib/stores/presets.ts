import { writable, derived, get } from 'svelte/store';
import { instrument, instrumentParameters, globalParameters, fxParameters, allParameters } from '$lib/stores/parameters';
import { envelopes } from '$lib/stores/envelopes';
import { connections } from '$lib/stores/patching';
import { isApp } from '$lib/stores/global';
import type { Envelope, Preset } from '$lib/types';

export const presets = writable({} as {[key: string]: Preset | null})

export const activePreset = writable('')

function initPresets() {
    const stored = JSON.parse(localStorage.getItem('q1synth-presets') || '{}');
    presets.update(presets => ({
        ...presets, 
        ...stored, 
        ['user 1']: null,
        ['user 2']: null,
        ['user 3']: null,
        ['user 4']: null,
    }))
    activePreset.set(Object.keys(get(presets)).sort((a, b) => a.localeCompare(b))[0])
}

initPresets();

presets.subscribe(presets => {
    localStorage.setItem('q1synth-presets', JSON.stringify(presets))
    isApp() && window.electronAPI.setUserPresets(presets)
})

isApp() && window.electronAPI.onSetPreset((key: string) => activePreset.set(key))

export const presetKeys = derived(
    presets,
    $presets => Object.keys($presets).sort((a, b) => a.localeCompare(b))
)

activePreset.subscribe(loadPreset)

function loadPreset(key: string) {
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
    const stored = JSON.parse(localStorage.getItem('q1synth-presets') || "{}");

    stored[key] = {
        instrument: get(instrument),
        envelopes: get(envelopes),
        params: get(allParameters).map(({key, rangeA, rangeB}) => ({key, rangeA, rangeB})),
        connections: get(connections)
    };
    localStorage.setItem('q1synth-presets', JSON.stringify(stored));

    presets.update(presets => ({...presets, ...stored}))
}