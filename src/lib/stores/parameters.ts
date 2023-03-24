import { writable, type Writable, get, derived, type Readable } from 'svelte/store';
import { axes, type Axis } from '$lib/stores/qubit';
import { setEnvelopes, envelopeValues } from './envelopes';
import { initialiseConnections, getConnections } from './patching';
import { mapToStepRange } from '$lib/utils/utils';
import { handleMutation } from '../../sound'
interface Parameter {
    key: string;
    name: string;
    rangeA: number;
    rangeB: number;
    min: number;
    max: number;
    step: number;
    units: string;
    outmin?: number;
    outmax?: number;
}

export const instrument: Writable<'synth' | 'granular' | 'subtractive'> = writable('synth');
export const instruments: ['synth', 'granular', 'subtractive'] = ['synth', 'granular', 'subtractive']

const baseParams: Parameter[] = [
    // Needs exponential range
    {key: 'cutoff', name: 'cutoff', rangeA: 10, rangeB: 20, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 20000},
    {key: 'res', name: 'res', rangeA: 0, rangeB: 25, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 0.95},
    {key: 'fila', name: 'filter', rangeA: 0, rangeB: 25, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 2000},
];

const iParams: {[key: string]: Parameter[]} = {
    synth: [
        {key: 'modi', name: 'modi', rangeA: 0, rangeB: 10, min: 0, max: 50, step: 0.01, units: '%', outmin: 0, outmax: 50},
        {key: 'harm', name: 'harm', rangeA: 2, rangeB: 2, min: 0.5, max: 10, step: 0.25, units: ''},
        {key: 'drift', name: 'drift', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 5},
        ...baseParams,
    ],
    granular: [
        {key: 'size', name: 'size', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
        {key: 'width', name: 'Width', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
        {key: 'grainrate', name: 'grain rate', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
        {key: 'grainsize', name: 'grain size', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
        {key: 'rate', name: 'rate', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
        {key: 'begin', name: 'begin', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
        {key: 'end', name: 'end', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
        ...baseParams,
    ],
    subtractive: [
        ...baseParams,
    ],
};

const gParams = [
    {key: 'semitone', name: 'dtune', rangeA: 0, rangeB: 0, min: -12, max: 12, step: 0.01, units: 'st'},
    {key: 'octave', name: 'Oct', rangeA: -1, rangeB: 0, min: -3, max: 3, step: 1, units: 'octs'},
    {key: 'vol', name: 'gain', rangeA: 0.75, rangeB: 0.75, min: 0, max: 1, step: 0.01, units: '', outmin: 0, outmax: 1},
    {key: 'pan', name: 'pan', rangeA: -0, rangeB: 0, min: -1, max: 1, step: 0.01, units: '', outmin: 0, outmax: 1},
]

const fxParams = [
    {key: 'reverb', name: 'Reverb', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 1},
    {key: 'rsize', name: 'RTime', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 1},
    {key: 'delay', name: 'Delay', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 1},
    {key: 'dtime', name: 'Dtime', rangeA: 10, rangeB: 2000, min: 10, max: 2000, step: 1, units: 'ms'},
    {key: 'dfb', name: 'Fback', rangeA: 10, rangeB: 50, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 0.99},
    {key: 'chorus', name: 'Chorus', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 1},
    {key: 'chdepth', name: 'CDepth', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 1},
    {key: 'dist', name: 'dist', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 1},
    // {key: 'drive', name: 'drive', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
    {key: 'hicut', name: 'hicut', rangeA: 0, rangeB: 0, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 1},
    {key: 'locut', name: 'locut', rangeA: 0, rangeB: 25, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 1},
]

export const instrumentParameters = writable(iParams.synth);
export const globalParameters = writable(gParams);
export const fxParameters = writable(fxParams);
export const allParameters: Readable<Parameter[]> = derived(
    [instrumentParameters, globalParameters, fxParameters], 
    ([$instrumentParameters, $globalParameters, $fxParameters]) => {
        return [...$instrumentParameters, ...$globalParameters, ...$fxParameters]
    }
);

export const paramValues: Readable<{[key: string]: number}> = derived(
    [allParameters, axes], 
    ([$allParameters]) => {
        return $allParameters.reduce((obj, param) => ({
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

initConnections('synth')

instrument.subscribe((instrument) => {
    instrumentParameters.set(iParams[instrument]);
    setEnvelopes(instrument);
    initConnections(instrument)
});

function scaleParamValue(key: string, value: number) {
    const param = get(allParameters).find((param) => param.key === key);
    
    return param && param.outmin !== undefined && param.outmax !== undefined
        ? mapToStepRange(value, param.min, param.max, param.outmin, param.outmax, param.step) 
        : value
}

const defaults = {
    dfilter: 0,
    dcolour: 0.5,
    drive: 0.5,
    fils: 1,
    lthresh: 0.75,
    gain: 0.75
}

// fetch and format parameters for synth event
export const synthValues: Readable<{[key: string]: number | string}> = derived(
    [paramValues, envelopeValues], 
    ([$paramValues, $envelopeValues]) => ({
        ...defaults,
        inst: get(instrument),
        ...get(envelopeValues),
        ...Object.entries($paramValues).reduce((obj, [key, value]) => ({
            ...obj,
            [key]: scaleParamValue(key, value)
        }), {})
    })
)

synthValues.subscribe((values) => {
    handleMutation(values)
})