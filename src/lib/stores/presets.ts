import { writable } from 'svelte/store';

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
]);

export const activePreset = writable(0);