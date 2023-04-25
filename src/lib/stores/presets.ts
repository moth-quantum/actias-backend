import { writable, get } from 'svelte/store';
import { instrument, allParameters } from '$lib/stores/parameters';
import { envelopes } from '$lib/stores/envelopes';
import { connections } from '$lib/stores/patching';
import type { Envelope } from '$lib/types';

export const presetKeys = writable([
    'Preset 1',
    'Preset 2',
    'Preset 3',
    'Preset 4',
    'Preset 5',
    'Preset 6',
    'Preset 7',
    'Preset 8',
    'Preset 9',
    'Preset 10',
    'Preset 11',
    'Preset 12',
    'Preset 13',
    'Preset 14',
    'Preset 15',
    'Preset 16',
])

export const activePreset = writable(0);

activePreset.subscribe((i) => {
    const presets = localStorage.getItem('q1synth-presets');
    if(!presets) return;
    
    const preset = JSON.parse(presets)[get(presetKeys)[i]]
    if(!preset) return;
    
    // update envelope values
    envelopes.update(envelopes => {
        return preset.envelopes.reduce((arr: [], envelope: Envelope, i: number) => ([
            ...arr,
            {...envelopes[i], a: envelope.a, d: envelope.d, s: envelope.s, r: envelope.r}
        ]), []);
    });
    
    // update instrument
    instrument.set(preset.instrument);

    // update connections
    connections.set(preset.connections);

    preset.params.forEach(({key, rangeA, rangeB} : {key: string, rangeA: number, rangeB: number}) => {
        const param = get(allParameters).find((param) => param.key === key);
        if(!param) return

        param.rangeA = rangeA;
        param.rangeB = rangeB;
    })
})

export const storePreset = (key: string) => {
    const stored = localStorage.getItem('q1synth-presets');
    const presets = stored ? JSON.parse(stored) : {};

    presets[key] = {
        instrument: get(instrument),
        envelopes: get(envelopes),
        params: get(allParameters).map(({key, rangeA, rangeB}) => ({key, rangeA, rangeB})),
        connections: get(connections)
    };
    localStorage.setItem('q1synth-presets', JSON.stringify(presets));
}
