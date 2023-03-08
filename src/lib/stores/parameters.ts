import { writable } from 'svelte/store';

interface Parameter {
    key: string;
    name: string;
    value: number;
    min: number;
    max: number;
    axis: 'x' | 'y' | 'z';
}

const instrumentParameters: {[key: string]: Parameter[]} = {
    fm: [
        {key: 'modi', name: 'Modulation Index', value: 0.5, min: 0, max: 100, axis: 'x'},
        {key: 'harm', name: 'Harmonicity', value: 0.5, min: 0, max: 100, axis: 'x'},
    ],
    granular: [
        {key: 'grainsize', name: 'Grain Size', value: 0.5, min: 0, max: 100, axis: 'x'},
        {key: 'overlap', name: 'Overlap', value: 0.5, min: 0, max: 100, axis: 'x'},
    ],
    subtractive: [
        {key: 'cutoff', name: 'Cutoff', value: 0.5, min: 0, max: 100, axis: 'x'},
        {key: 'resonance', name: 'Resonance', value: 0.5, min: 0, max: 100, axis: 'x'},
    ],
};

export const fxParameters: Parameter[] = [
    {key: 'delay', name: 'Delay', value: 0.5, min: 0, max: 100, axis: 'x'},
    {key: 'reverb', name: 'Reverb', value: 0.5, min: 0, max: 100, axis: 'x'},
    {key: 'chorus', name: 'Chorus', value: 0.5, min: 0, max: 100, axis: 'x'},
    {key: 'phaser', name: 'Phaser', value: 0.5, min: 0, max: 100, axis: 'x'},
];

export const parameters = writable(instrumentParameters.fm);

export const loadInstrument = (instrument: 'fm' | 'granular' | 'subtractive') => {
    parameters.set(instrumentParameters[instrument]);
}

