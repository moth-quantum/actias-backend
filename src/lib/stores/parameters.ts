import { writable, type Writable, get, derived, type Readable } from 'svelte/store';
import { axes, isMeasuring } from '$lib/stores/qubits'
import { samples } from '$lib/stores/samples';
import { envelopeValues } from './envelopes';
import { redrawCables, getConnections, connections} from './patching';
import { mapToStepRange, roundToFactor } from '$lib/utils/utils';
import type { InstrumentName, Parameter, Dictionary } from '$lib/types';

export const instrument: Writable<InstrumentName> = writable('demo');
export const instruments: {name: InstrumentName, active: boolean}[] = [
    {name: 'demo', active: true},
    {name: 'synth', active: false},
    {name: 'sampler', active: false},
    {name: 'granular', active: false},
    {name: 'wavetable', active: false},
]

const instrumentKeys: Dictionary = {
    demo: ['op2ratio', 'op2gain'],
    synth: ['op1fb','op2ratio', 'op2gain', 'op2fb', 'op3ratio', 'op3gain', 'op3fb'],
    sampler: ['i', 'loop', 'loopsize', 'rate', 'begin', 'cutoff', 'res'],
    granular: ['i', 'grainrate', 'grainsize', 'grainpan', 'begin', 'end', 'cutoff', 'res'],
    wavetable: ['i', 'tablesize', 'rows', 'xlfo', 'ylfo', 'cutoff', 'res']
}

export const keys = writable(instrumentKeys.demo);

const instParams: Parameter[] = [
    {type: 'range', key: 'op1fb', name: 'op1fb', rangeA: 0, rangeB: 1, min: 0, max: 1, step: 0.01, units: '', outmin: 0, outmax: 1, isLocked: false},
    {type: 'range', key: 'op2ratio', name: 'op2r', rangeA: 0.5, rangeB: 5, min: 0.5, max: 20, step: 0.5, units: '', isLocked: false},
    {type: 'range', key: 'op2gain', name: 'op2g', rangeA: 0, rangeB: 1, min: 0, max: 10, step: 0.01, units: '', isLocked: false},
    {type: 'range', key: 'op2fb', name: 'op2fb', rangeA: 0, rangeB: 1, min: 0, max: 1, step: 0.01, units: '', outmin: 0, outmax: 1, isLocked: false},
    {type: 'range', key: 'op3ratio', name: 'op3r', rangeA: 0.5, rangeB: 11, min: 0.5, max: 20, step: 0.25, units: '', isLocked: false},
    {type: 'range', key: 'op3gain', name: 'op3g', rangeA: 0.25, rangeB: 1, min: 0, max: 1, step: 0.01, units: '', isLocked: false},
    {type: 'range', key: 'op3fb', name: 'op3fb', rangeA: 0, rangeB: 1, min: 0, max: 1, step: 0.01, units: '', outmin: 0, outmax: 1, isLocked: false},
    
    {type: 'select', key: 'i', name: 'sample', rangeA: 0, rangeB: 0, min: 0, max: get(samples).length, step: 1, units: '', isLocked: false},
    {type: 'range', key: 'loop', name: 'loop', rangeA: 1, rangeB: 1, min: 0, max: 1, step: 1, units: '', isLocked: false},
    {type: 'range', key: 'loopsize', name: 'size', rangeA: 1, rangeB: 1, min: 0.001, max: 1, step: 0.001, units: '', isLocked: false},
    {type: 'range', key: 'rate', name: 'rate', rangeA: 1, rangeB: 1, min: -1, max: 2, step: 0.125, units: '', isLocked: false},
    {type: 'range', key: 'begin', name: 'begin', rangeA: 0, rangeB: 1, min: 0, max: 1, step: 0.001, units: '', isLocked: false},
    {type: 'range', key: 'end', name: 'end', rangeA: 1, rangeB: 0, min: 0, max: 1, step: 0.001, units: '', isLocked: false},
    {type: 'range', key: 'grainrate', name: 'rate', rangeA: 8, rangeB: 16, min: 1, max: 64, step: 1, units: '', isLocked: false},
    {type: 'range', key: 'grainsize', name: 'size', rangeA: 0.1, rangeB: 1, min: 0.001, max: 1, step: 0.001, units: '', isLocked: false},
    {type: 'range', key: 'grainpan', name: 'pan', rangeA: 0, rangeB: 1, min: 0, max: 1, step: 0.001, units: '', isLocked: false},
    // Needs exponential range
    {type: 'range', key: 'cutoff', name: 'cutoff', rangeA: 50, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 20000, isLocked: false},
    {type: 'range', key: 'res', name: 'res', rangeA: 0, rangeB: 25, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 0.95, isLocked: false},

    {type: 'range', key: 'tablesize', name: 'size', rangeA: 256, rangeB: 256, min: 16, max: 1024, step: 1, units: '', isLocked: false},
    {type: 'range', key: 'rows', name: 'rows', rangeA: 16, rangeB: 16, min: 2, max: 64, step: 1, units: '', isLocked: false},
    {type: 'range', key: 'xlfo', name: 'xlfo', rangeA: 0.02, rangeB: 0.3, min: 0.01, max: 0.5, step: 0.01, units: '', isLocked: false},
    {type: 'range', key: 'ylfo', name: 'ylfo', rangeA: 0.2, rangeB: 0.03, min: 0.01, max: 1, step: 0.01, units: '', isLocked: false},
]

const gParams: Parameter[] = [
    {type: 'range', key: 'semitone', name: 'dtune', rangeA: 0, rangeB: 0, min: -12, max: 12, step: 0.1, units: 'st', isLocked: false},
    {type: 'range', key: 'octave', name: 'Oct', rangeA: 0, rangeB: 0, min: -3, max: 3, step: 1, units: 'octs', isLocked: false},
    {type: 'range', key: 'vol', name: 'gain', rangeA: 0.75, rangeB: 0.75, min: 0, max: 2, step: 0.01, units: '', outmin: 0, outmax: 2, isLocked: false},
    {type: 'range', key: 'pan', name: 'pan', rangeA: -0, rangeB: 0, min: -1, max: 1, step: 0.01, units: '', outmin: 0, outmax: 1, isLocked: false},
]

const fxParams: Parameter[] = [
    {type: 'range', key: 'reverb', name: 'Reverb', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 1, isLocked: false},
    {type: 'range', key: 'rsize', name: 'RTime', rangeA: 50, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 1, isLocked: false},
    {type: 'range', key: 'delay', name: 'Delay', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 1, isLocked: false},
    {type: 'range', key: 'dtime', name: 'Dtime', rangeA: 10, rangeB: 2000, min: 10, max: 2000, step: 1, units: 'ms', isLocked: false},
    {type: 'range', key: 'dcolour', name: 'DColour', rangeA: 25, rangeB: 50, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 1, isLocked: false},
    {type: 'range', key: 'dfb', name: 'Fback', rangeA: 10, rangeB: 50, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 0.99, isLocked: false},
    {type: 'range', key: 'chorus', name: 'Chorus', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 1, isLocked: false},
    {type: 'range', key: 'chdepth', name: 'CDepth', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 1, isLocked: false},
    {type: 'range', key: 'dist', name: 'dist', rangeA: 0, rangeB: 10, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 1, isLocked: false},
    {type: 'range', key: 'crush', name: 'crush', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 1, isLocked: false},
    // {type: 'range', key: 'drive', name: 'drive', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%', isLocked: false},
    {type: 'range', key: 'hicut', name: 'hicut', rangeA: 0, rangeB: 0, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 1, isLocked: false},
    {type: 'range', key: 'locut', name: 'locut', rangeA: 0, rangeB: 25, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 1, isLocked: false},
]

const demoParams: Parameter[] = [
    {type: 'range', key: 'op2ratio', name: 'FMPitch', rangeA: 0.5, rangeB: 20, min: 0.5, max: 20, step: 0.5, units: '', isLocked: false},
    {type: 'range', key: 'op2gain', name: 'FMAmt', rangeA: 0, rangeB: 10, min: 0, max: 10, step: 0.01, units: '', isLocked: false},
    {type: 'range', key: 'semitone', name: 'dtune', rangeA: -12, rangeB: 12, min: -12, max: 12, step: 0.1, units: 'st', isLocked: false},
    {type: 'range', key: 'pan', name: 'pan', rangeA: -1, rangeB: 1, min: -1, max: 1, step: 0.01, units: '', outmin: 0, outmax: 1, isLocked: false},
    {type: 'range', key: 'reverb', name: 'Reverb', rangeA: 0, rangeB: 100, min: 0, max: 100, step: 0.01, units: '%', outmin: 0, outmax: 1, isLocked: false},
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
export const demoParameters = writable(demoParams);
export const allParameters: Readable<Parameter[]> = derived(
    [instrumentParameters, globalParameters, fxParameters, demoParameters], 
    ([$instrumentParameters, $globalParameters, $fxParameters, $demoParameters]) => {
        return [...$instrumentParameters, ...$globalParameters, ...$fxParameters, ...$demoParameters]
    }
);

const prevParamValues: Writable<{[key: string]: number}> = writable({});
export const paramValues: Readable<{[key: string]: number}> = derived(
    [
        allParameters, 
        connections, 
        ...axes
    ], 
    ([$allParameters]) => {
        const nextParamValues = $allParameters.reduce((obj, param) => ({
            ...obj,
            [param.key]: (param.isLocked 
                ? get(prevParamValues)[param.key]
                : param.rangeA + (param.rangeB - param.rangeA) * getAxis(param.key))
        }), {})

        prevParamValues.set(nextParamValues);

        return nextParamValues;
    });

function getAxis(key: string) : number {
    const connection = getConnections(key)[0];
    if (!connection) return 0;
    const axis = connection.charAt(0);
    const qubitIndex = parseInt(connection.slice(1)) || 0;
    const axisIndex = ['x','y','z'].indexOf(axis);
    return get(axes[qubitIndex])[axisIndex];
}

instrument.subscribe((instrument) => {
    // update available keys
    keys.set(instrumentKeys[instrument]);
    redrawCables();
});

function scaleParamValue(key: string, value: number) {
    const param = get(allParameters).find((param) => param.key === key);
    
    return param && param.outmin !== undefined && param.outmax !== undefined
        ? mapToStepRange(value, param.min, param.max, param.outmin, param.outmax, param.step) 
        : roundToFactor(value, param ? param.step : 0.01);
}

const defaults = {
    dfilter: 0,
    dcolour: 0.5,
    drive: 0.5,
    fils: 1,
    lthresh: 0.75,
    gain: 1,
    dur: 600000,
}

const formatEnvelopeValues = (values: any, instrument: string) => {
    const { a1, d1, s1, r1 } = values;   
    const key = instrument === 'synth' ? 'op2' : 'fil';
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
        inst: $instrument === 'demo' ? 'synth' : $instrument,
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
// switch off drone at the end of the measurement
isMeasuring.subscribe((measuring) => {
    !measuring && drone.set(false);
})

export const getAppState = () => {
    return {
        instrument: get(instrument),
        instrumentParameters: get(instrumentParameters),
        globalParameters: get(globalParameters),
        fxParameters: get(fxParameters),
        axes: get(axes[0]),
        connections: get(connections),
        drone: get(drone),
        envelopeValues: get(envelopeValues),
    }
}