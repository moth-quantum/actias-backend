import { writable, type Writable, get, derived, type Readable } from 'svelte/store';
import { axes, type Axis } from '$lib/stores/qubit';
import { setEnvelopes } from './envelopes';
import { initialiseConnections, getConnections } from './patching';
interface Parameter {
    key: string;
    name: string;
    rangeA: number;
    rangeB: number;
    min: number;
    max: number;
    step: number;
    units: string;
}

export const instrument: Writable<'fm' | 'granular' | 'subtractive'> = writable('fm');
export const instruments: ['fm', 'granular', 'subtractive'] = ['fm', 'granular', 'subtractive']

const iParams: {[key: string]: Parameter[]} = {
    fm: [
        {key: 'modi', name: 'modi', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
        {key: 'harm', name: 'harm', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
        {key: 'coff', name: 'cut off', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
        {key: 'res', name: 'res', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
    ],
    granular: [
        {key: 'size', name: 'size', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
        {key: 'width', name: 'Width', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
        {key: 'coff', name: 'coff', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
        {key: 'res', name: 'res', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
        {key: 'grainrate', name: 'grain rate', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
        {key: 'grainsize', name: 'grain size', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
        {key: 'rate', name: 'rate', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
        {key: 'begin', name: 'begin', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
        {key: 'end', name: 'end', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
    ],
    subtractive: [
        {key: 'coff', name: 'coff', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
        {key: 'res', name: 'res', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
    ],
};

export const instrumentParameters = writable(iParams.fm);

const gParams = [
    {key: 'dtune', name: 'dtune', rangeA: -12, rangeB: 12, min: -12, max: 12, step: 0.01, units: 'st'},
    {key: 'octave', name: 'Oct', rangeA: -3, rangeB: 3, min: -3, max: 3, step: 1, units: 'octs'},
    {key: 'gain', name: 'gain', rangeA: -50, rangeB: 5, min: -50, max: 5, step: 0.5, units: 'dB'},
    {key: 'pan', name: 'pan', rangeA: -100, rangeB: 100, min: -100, max: 100, step: 1, units: '%'},
]

export const globalParameters = writable(gParams);

const fxParams = [
    {key: 'reverb', name: 'Reverb', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
    {key: 'rsize', name: 'Reverb Time', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
    {key: 'delay', name: 'Delay', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
    {key: 'dtime', name: 'Delay time', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
    {key: 'chorus', name: 'Chorus', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
    {key: 'chdepth', name: 'Chorus Depth', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
    {key: 'dist', name: 'dist', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
    {key: 'drive', name: 'drive', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
    {key: 'hicut', name: 'hicut', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
    {key: 'locut', name: 'locut', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
]

export const fxParameters = writable(fxParams);

export const paramValues: Readable<{[key: string]: number}> = derived(
    [instrumentParameters, globalParameters, fxParameters, axes], 
    ([$instrumentParameters, $globalParameters, $fxParameters]) => {
        return [...$instrumentParameters, ...$globalParameters, ...$fxParameters].reduce((obj, param) => ({
            ...obj,
            [param.key]: param.rangeA + (param.rangeB - param.rangeA) * getAxis(param.key).value || 0
        }), {})
    })

function getAxis(key: string) : Axis {
    const currentAxes: Axis[] = get(axes);
    const connections = getConnections(key);
    return currentAxes.find((axis) => connections.includes(axis.key)) || currentAxes[0]
}

const initConnections = (instrument: string) => initialiseConnections([
    ...iParams[instrument],
    ...gParams,
    ...fxParams,
].map(({key}) => key), ['y', 'x', 'z']);

initConnections('fm')

instrument.subscribe((instrument) => {
    instrumentParameters.set(iParams[instrument]);
    setEnvelopes(instrument);
    initConnections(instrument)
});