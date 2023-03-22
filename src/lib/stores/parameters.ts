import { writable, type Writable } from 'svelte/store';

import { setEnvelopes } from './envelopes';
import { initialiseConnections } from './patching';

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

export const instrument: Writable<'fm' | 'granular' | 'subtractive'> = writable('fm');
export const instruments: ['fm', 'granular', 'subtractive'] = ['fm', 'granular', 'subtractive']
export const axes: ['θ', 'φ', 'λ'] = ['θ', 'φ', 'λ'];

const iParams: {[key: string]: Parameter[]} = {
    fm: [
        {key: 'modi', name: 'modi', value: 50, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
        {key: 'harm', name: 'harm', value: 50, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
    ],
    granular: [
        {key: 'size', name: 'size', value: 50, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
        {key: 'width', name: 'Width', value: 50, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
    ],
    subtractive: [
        {key: 'coff', name: 'coff', value: 50, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
        {key: 'res', name: 'res', value: 50, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
    ],
};

export const instrumentParameters = writable(iParams.fm);

const gParams = [
    {key: 'dtune', name: 'dtune', value: 0, rangeA: 0, rangeB: 100, min: -12, max: 12, step: 0.01, units: 'st'},
    {key: 'octave', name: 'Oct', value: 0, rangeA: -3, rangeB: 3, min: -3, max: 3, step: 1, units: 'octs'},
    {key: 'gain', name: 'gain', value: 0, rangeA: -50, rangeB: 3, min: -50, max: 5, step: 0.5, units: 'dB'},
]

export const globalParameters = writable(gParams);

const fxParams = [
    {key: 'delay', name: 'Delay', value: 50, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
    {key: 'reverb', name: 'Reverb', value: 50, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
    {key: 'chorus', name: 'Chorus', value: 50, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
    {key: 'phaser', name: 'Phaser', value: 50, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
]

export const fxParameters = writable(fxParams);

instrument.subscribe((instrument) => {
    instrumentParameters.set(iParams[instrument]);
    setEnvelopes(instrument);

    // const keys = [
    //     ...iParams[instrument],
    //     ...gParams,
    //     ...fxParams,
    // ].map(({key}) => key)
    
    //  resetConnections(keys, axes);
});

initialiseConnections([
    ...iParams.fm,
    ...gParams,
    ...fxParams,
].map(({key}) => key), axes);

