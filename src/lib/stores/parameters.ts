import { writable, type Writable } from 'svelte/store';

import { setEnvelopes } from './envelopes';

interface Parameter {
    key: string;
    name: string;
    value: number;
    rangeA: number;
    rangeB: number;
    min: number;
    max: number;
    step: number;
    units: string;
}

const instrumentParameters: {[key: string]: Parameter[]} = {
    fm: [
        {key: 'modi', name: 'Modulation Index', value: 50, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
        {key: 'harm', name: 'Harmonicity', value: 50, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
    ],
    granular: [
        {key: 'size', name: 'Grain Size', value: 50, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
        {key: 'width', name: 'Width', value: 50, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
    ],
    subtractive: [
        {key: 'coff', name: 'Cutoff', value: 50, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
        {key: 'res', name: 'Resonance', value: 50, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
    ],
};

export const globalParameters = writable([
    {key: 'dtune', name: 'Detune', value: 0, rangeA: 0, rangeB: 100, min: -12, max: 12, step: 0.01, units: 'st'},
    {key: 'octave', name: 'Octave', value: 0, rangeA: -3, rangeB: 3, min: -3, max: 3, step: 1, units: 'octs'},
    {key: 'gain', name: 'Gain', value: 0, rangeA: -50, rangeB: 3, min: -50, max: 5, step: 0.5, units: 'dB'},
]);

export const fxParameters = writable([
    {key: 'delay', name: 'Delay', value: 50, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
    {key: 'reverb', name: 'Reverb', value: 50, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
    {key: 'chorus', name: 'Chorus', value: 50, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
    {key: 'phaser', name: 'Phaser', value: 50, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
]);

export const instrument: Writable<'fm' | 'granular' | 'subtractive'> = writable('fm');
export const instruments: ['fm', 'granular', 'subtractive'] = ['fm', 'granular', 'subtractive']
export const parameters = writable(instrumentParameters.fm);

instrument.subscribe((instrument) => {
    parameters.set(instrumentParameters[instrument]);
    setEnvelopes(instrument);
});

