import { writable, get } from 'svelte/store';
import { instrument, allParameters } from '$lib/stores/parameters';
import { envelopes } from '$lib/stores/envelopes';

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
    
    console.log(preset.envelopes)
    instrument.set(preset.instrument);
    // envelopes.set(preset.envelopes);
    // preset.params.forEach(({key, rangeA, rangeB}) => {

})

export const storePreset = (key: string) => {
    const stored = localStorage.getItem('q1synth-presets');
    const presets = stored ? JSON.parse(stored) : {};

    presets[key] = {
        instrument: get(instrument),
        envelopes: get(envelopes),
        params: get(allParameters).map(({key, rangeA, rangeB}) => ({key, rangeA, rangeB}))
    };
    localStorage.setItem('q1synth-presets', JSON.stringify(presets));
}
