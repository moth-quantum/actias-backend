import { writable, type Writable, get, derived, type Readable } from 'svelte/store';
import { axes, type Axis } from '$lib/stores/qubit';
import { samples } from '$lib/stores/samples';
import { envelopeValues } from './envelopes';
import { initialiseConnections, getConnections, connections} from './patching';
import { mapToStepRange, roundToFactor } from '$lib/utils/utils';
import type { InstrumentName, Parameter } from '$lib/types';

export const instrument: Writable<InstrumentName> = writable('synth');
export const instruments: InstrumentName[] = ['synth', 'sampler', 'granular']

const instrumentKeys = {
    synth: ['modi', 'harm', 'drift', 'cutoff', 'res'],
    sampler: ['i', 'loop', 'loopsize', 'rate', 'begin', 'cutoff', 'res'],
    granular: ['i', 'grainrate', 'grainsize', 'grainpan', 'begin', 'end', 'cutoff', 'res']
}

export const keys = writable(instrumentKeys.synth);

const instParams: Parameter[] = [
    {key: 'modi', name: 'modi', rangeA: 0, rangeB: 10, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 50},
    {key: 'harm', name: 'harm', rangeA: 2, rangeB: 2, min: 0.5, max: 10, step: 0.25, units: ''},
    {key: 'drift', name: 'drift', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 5},
    {key: 'i', name: 'sample', rangeA: 0, rangeB: 0, min: 0, max: get(samples).length, step: 1, units: ''},
    {key: 'loop', name: 'loop', rangeA: 1, rangeB: 1, min: 0, max: 1, step: 1, units: ''},
    {key: 'loopsize', name: 'size', rangeA: 1, rangeB: 1, min: 0.001, max: 1, step: 0.001, units: ''},
    {key: 'rate', name: 'rate', rangeA: 1, rangeB: 1, min: -1, max: 2, step: 0.125, units: ''},
    {key: 'begin', name: 'begin', rangeA: 0, rangeB: 1, min: 0, max: 1, step: 0.001, units: ''},
    {key: 'end', name: 'end', rangeA: 1, rangeB: 0, min: 0, max: 1, step: 0.001, units: ''},
    {key: 'grainrate', name: 'rate', rangeA: 8, rangeB: 16, min: 1, max: 64, step: 1, units: ''},
    {key: 'grainsize', name: 'size', rangeA: 0.1, rangeB: 1, min: 0.001, max: 1, step: 0.001, units: ''},
    {key: 'grainpan', name: 'pan', rangeA: 0, rangeB: 1, min: 0, max: 1, step: 0.001, units: ''},
    // Needs exponential range
    {key: 'cutoff', name: 'cutoff', rangeA: 50, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 20000},
    {key: 'res', name: 'res', rangeA: 0, rangeB: 25, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 0.95},
]

const gParams: Parameter[] = [
    {key: 'semitone', name: 'dtune', rangeA: 0, rangeB: 0, min: -12, max: 12, step: 0.1, units: 'st'},
    {key: 'octave', name: 'Oct', rangeA: 0, rangeB: 0, min: -3, max: 3, step: 1, units: 'octs'},
    {key: 'vol', name: 'gain', rangeA: 0.75, rangeB: 0.75, min: 0, max: 2, step: 0.01, units: '', outmin: 0, outmax: 2},
    {key: 'pan', name: 'pan', rangeA: -0, rangeB: 0, min: -1, max: 1, step: 0.01, units: '', outmin: 0, outmax: 1},
]

const fxParams: Parameter[] = [
    {key: 'reverb', name: 'Reverb', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 1},
    {key: 'rsize', name: 'RTime', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 1},
    {key: 'delay', name: 'Delay', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 1},
    {key: 'dtime', name: 'Dtime', rangeA: 10, rangeB: 2000, min: 10, max: 2000, step: 1, units: 'ms'},
    {key: 'dcolour', name: 'DColour', rangeA: 25, rangeB: 50, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 1},
    {key: 'dfb', name: 'Fback', rangeA: 10, rangeB: 50, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 0.99},
    {key: 'chorus', name: 'Chorus', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 1},
    {key: 'chdepth', name: 'CDepth', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 1},
    {key: 'dist', name: 'dist', rangeA: 0, rangeB: 10, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 1},
    {key: 'crush', name: 'crush', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 1},
    // {key: 'drive', name: 'drive', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%'},
    {key: 'hicut', name: 'hicut', rangeA: 0, rangeB: 0, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 1},
    {key: 'locut', name: 'locut', rangeA: 0, rangeB: 25, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 1},
]

export const instrumentParameters = writable(instParams);

samples.subscribe(s => {
    instrumentParameters.update(params => params.map((param) => param.key === 'i' 
        ? {...param, max: s.length} 
        : param
    ))
});

export const globalParameters = writable(gParams);
export const fxParameters = writable(fxParams);
export const allParameters: Readable<Parameter[]> = derived(
    [instrumentParameters, globalParameters, fxParameters], 
    ([$instrumentParameters, $globalParameters, $fxParameters]) => {
        return [...$instrumentParameters, ...$globalParameters, ...$fxParameters]
    }
);

export const paramValues: Readable<{[key: string]: number}> = derived(
    [allParameters, axes, connections], 
    ([$allParameters, $axes, $connections]) => {
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

const initConnections = () => initialiseConnections([
    ...instParams,
    ...gParams,
    ...fxParams,
].map(({key}) => key), ['z', 'y', 'x']);

initConnections()

instrument.subscribe((instrument) => {
    keys.set(instrumentKeys[instrument]);
});

function scaleParamValue(key: string, value: number) {
    const param = get(allParameters).find((param) => param.key === key);
    
    return param && param.outmin !== undefined && param.outmax !== undefined
        ? mapToStepRange(value, param.min, param.max, param.outmin, param.outmax, param.step) 
        : roundToFactor(value, param.step)
}

const defaults = {
    dfilter: 0,
    dcolour: 0.5,
    drive: 0.5,
    fils: 1,
    lthresh: 0.75,
    gain: 1,
    dur: 60000,
}

const formatEnvelopeValues = (values, instrument: string) => {
    const { a1, d1, s1, r1 } = values;   
    const key = instrument === 'synth' ? 'mod' : 'fil';
    return {
        ...values,
        [`${key}a`]: a1,
        [`${key}d`]: d1,
        [`${key}s`]: s1,
        [`${key}r`]: r1
    }
}

// fetch and format parameters for synth event
export const synthValues: Readable<{[key: string]: number | string}> = derived(
    [paramValues, envelopeValues, instrument], 
    ([$paramValues, $envelopeValues, $instrument]) => ({
        ...defaults,
        inst: $instrument,
        ...formatEnvelopeValues($envelopeValues, $instrument),
        ...Object.entries($paramValues).reduce((obj, [key, value]) => ({
            ...obj,
            [key]: scaleParamValue(key, value)
        }), {})
    })
)

export function randomise(type: 'inst' | 'global' | 'fx') {
    const func = (p: Parameter) => ({
        ...p,
        rangeA: mapToStepRange(Math.random(), 0, 1, p.min, p.max, p.step),
        rangeB: mapToStepRange(Math.random(), 0, 1, p.min, p.max, p.step),
    })

    type === 'inst' && instrumentParameters.update((params: Parameter[]) => params.map(func));
    type === 'global' && globalParameters.update((params: Parameter[]) => params.map(func));
    type === 'fx' && fxParameters.update((params: Parameter[]) => params.map(func));
    
    return true;
}

export const drone = writable(false);