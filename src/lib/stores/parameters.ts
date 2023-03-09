import { writable } from 'svelte/store';

import { setEnvelopes } from './envelopes';

interface Parameter {
    key: string;
    name: string;
    value: number;
    min: number;
    max: number;
}

const instrumentParameters: {[key: string]: Parameter[]} = {
    fm: [
        {key: 'modi', name: 'Modulation Index', value: 0.5, min: 0, max: 100},
        {key: 'harm', name: 'Harmonicity', value: 0.5, min: 0, max: 100},
    ],
    granular: [
        {key: 'grainsize', name: 'Grain Size', value: 0.5, min: 0, max: 100},
        {key: 'overlap', name: 'Overlap', value: 0.5, min: 0, max: 100},
    ],
    subtractive: [
        {key: 'cutoff', name: 'Cutoff', value: 0.5, min: 0, max: 100},
        {key: 'resonance', name: 'Resonance', value: 0.5, min: 0, max: 100},
    ],
};

export const fxParameters: Parameter[] = [
    {key: 'delay', name: 'Delay', value: 0.5, min: 0, max: 100},
    {key: 'reverb', name: 'Reverb', value: 0.5, min: 0, max: 100},
    {key: 'chorus', name: 'Chorus', value: 0.5, min: 0, max: 100},
    {key: 'phaser', name: 'Phaser', value: 0.5, min: 0, max: 100},
];

export const parameters = writable(instrumentParameters.fm);

export const setInstrument = (instrument: 'fm' | 'granular' | 'subtractive') => {
    parameters.set(instrumentParameters[instrument]);
    setEnvelopes(instrument);
}

