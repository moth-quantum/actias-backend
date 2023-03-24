import { writable, type Writable, get, derived, type Readable } from 'svelte/store';
import { axes, type Axis } from '$lib/stores/qubit';
import { setEnvelopes } from './envelopes';
import { initialiseConnections, getConnections } from './patching';
import { mapToRange } from '$lib/utils/utils';
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
        {key: 'harm', name: 'harm', rangeA: 0.5, rangeB: 10, min: 0.5, max: 10, step: 0.05, units: ''},
        {key: 'drift', name: 'drift', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 20},
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
    {key: 'dtune', name: 'dtune', rangeA: -12, rangeB: 12, min: -12, max: 12, step: 0.01, units: 'st'},
    {key: 'octave', name: 'Oct', rangeA: -3, rangeB: 3, min: -3, max: 3, step: 1, units: 'octs'},
    // TODO: scale this properly
    {key: 'gain', name: 'gain', rangeA: -50, rangeB: 5, min: -50, max: 5, step: 0.5, units: 'dB', outmin: 0, outmax: 1.1},
    {key: 'pan', name: 'pan', rangeA: -0, rangeB: 0, min: -1, max: 1, step: 0.01, units: '', outmin: 0, outmax: 1},
]

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
        ? mapToRange(value, param.min, param.max, param.outmin, param.outmax) 
        : value
}

// fetch and format parameters for synth event
export const synthValues: Readable<{[key: string]: number | string}> = derived(
    [paramValues], 
    ([$paramValues]) => ({
        inst: get(instrument),
        ...Object.entries($paramValues).reduce((obj, [key, value]) => ({
            ...obj,
            [key]: scaleParamValue(key, value)
        }), {})
    })
)

synthValues.subscribe((values) => {
    handleMutation(values)
})