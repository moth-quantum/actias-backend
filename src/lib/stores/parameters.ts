import { writable, type Writable } from 'svelte/store';

import { setEnvelopes } from './envelopes';

interface Parameter {
    key: string;
    name: string;
    value: number;
    min: number;
    max: number;
    step: number;
}

const instrumentParameters: {[key: string]: Parameter[]} = {
    fm: [
        {key: 'modi', name: 'Modulation Index', value: 0.5, min: 0, max: 1, step: 0},
        {key: 'harm', name: 'Harmonicity', value: 0.5, min: 0, max: 1, step: 0},
    ],
    granular: [
        {key: 'grainsize', name: 'Grain Size', value: 0.5, min: 0, max: 1, step: 0},
        {key: 'overlap', name: 'Overlap', value: 0.5, min: 0, max: 1, step: 0},
    ],
    subtractive: [
        {key: 'cutoff', name: 'Cutoff', value: 0.5, min: 0, max: 1, step: 0},
        {key: 'resonance', name: 'Resonance', value: 0.5, min: 0, max: 1, step: 0},
    ],
};

export const globalParameters: Parameter[] = [
    {key: 'detune', name: 'Detune', value: 0, min: -1, max: 1, step: 0},
    {key: 'octave', name: 'Octave', value: 0, min: -3, max: 3, step: 1},
    {key: 'gain', name: 'Gain', value: 0.5, min: 0, max: 1, step: 0},
];

export const fxParameters: Parameter[] = [
    {key: 'delay', name: 'Delay', value: 0.5, min: 0, max: 1, step: 0},
    {key: 'reverb', name: 'Reverb', value: 0.5, min: 0, max: 1, step: 0},
    {key: 'chorus', name: 'Chorus', value: 0.5, min: 0, max: 1, step: 0},
    {key: 'phaser', name: 'Phaser', value: 0.5, min: 0, max: 1, step: 0},
];

export const instrument: Writable<'fm' | 'granular' | 'subtractive'> = writable('fm');
export const instruments: ['fm', 'granular', 'subtractive'] = ['fm', 'granular', 'subtractive']
export const parameters = writable(instrumentParameters.fm);

instrument.subscribe((instrument) => {
    parameters.set(instrumentParameters[instrument]);
    setEnvelopes(instrument);
});

