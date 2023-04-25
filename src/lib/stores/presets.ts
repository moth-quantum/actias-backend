import { writable, derived, get } from 'svelte/store';
import { instrument, allParameters } from '$lib/stores/parameters';
import { envelopes } from '$lib/stores/envelopes';
import { connections } from '$lib/stores/patching';
import type { Envelope, Preset } from '$lib/types';

export const presets = writable({} as {[key: string]: Preset | null})

export const active = writable('')

function initPresets() {
    const stored = JSON.parse(localStorage.getItem('q1synth-presets') || '{}');
    presets.update(presets => ({
        ...presets, 
        ...stored, 
        ['custom 1']: null,
        ['custom 2']: null,
        ['custom 3']: null,
        ['custom 4']: null,
    }))
    active.set(Object.keys(get(presets)).sort((a, b) => a.localeCompare(b))[0])
}

initPresets();
presets.subscribe(presets => localStorage.setItem('q1synth-presets', JSON.stringify(presets)))

export const presetKeys = derived(
    presets,
    $presets => Object.keys($presets).sort((a, b) => a.localeCompare(b))
)

active.subscribe(loadPreset)

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

    // update params
    preset.params.forEach(({key, rangeA, rangeB} : {key: string, rangeA: number, rangeB: number}) => {
        const param = get(allParameters).find((param) => param.key === key);
        if(!param) return

        param.rangeA = rangeA;
        param.rangeB = rangeB;
    })
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