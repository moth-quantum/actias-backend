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
        {key: 'coff', name: 'cut off', value: 50, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
        {key: 'res', name: 'res', value: 50, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
    ],
    granular: [
        {key: 'size', name: 'size', value: 50, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
        {key: 'width', name: 'Width', value: 50, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
        {key: 'coff', name: 'coff', value: 50, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
        {key: 'res', name: 'res', value: 50, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
        {key: 'grainrate', name: 'grain rate', value: 50, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
        {key: 'grainsize', name: 'grain size', value: 50, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
        {key: 'rate', name: 'rate', value: 50, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
        {key: 'begin', name: 'begin', value: 50, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
        {key: 'end', name: 'end', value: 50, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
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
    {key: 'pan', name: 'pan', value: 0, rangeA: -100, rangeB: 100, min: -100, max: 100, step: 1, units: '%'},
]

export const globalParameters = writable(gParams);

const fxParams = [
    {key: 'reverb', name: 'Reverb', value: 50, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
    {key: 'rsize', name: 'Reverb Time', value: 50, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
    {key: 'delay', name: 'Delay', value: 0, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
    {key: 'dtime', name: 'Delay time', value: 50, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
    {key: 'chorus', name: 'Chorus', value: 50, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
    {key: 'chdepth', name: 'Chorus Depth', value: 50, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
    {key: 'dist', name: 'dist', value: 0, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
    {key: 'drive', name: 'drive', value: 0, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
    {key: 'hicut', name: 'hicut', value: 0, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
    {key: 'locut', name: 'locut', value: 0, rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
]

export const fxParameters = writable(fxParams);

const initConnections = (instrument: string) => initialiseConnections([
    ...iParams[instrument],
    ...gParams,
    ...fxParams,
].map(({key}) => key), axes);

initConnections('fm')

instrument.subscribe((instrument) => {
    instrumentParameters.set(iParams[instrument]);
    setEnvelopes(instrument);
    initConnections(instrument)
});




