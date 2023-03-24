import { writable } from 'svelte/store';

interface Envelope {
    key: string;
    name: string;
    values: {
        a: number;
        d: number;
        s: number;
        r: number;
    }
}

const instrumentEnvelopes: {[key: string]: Envelope[]} = {
    synth: [
        {key: 'amp', name: 'Amp', values: {a: 0.01, d: 0.15, s: 0.5, r: 0.5}},
        {key: 'modulation', name: 'Mod', values: {a: 0.01, d: 0.15, s: 0.5, r: 0.5}},
    ],
    granular: [
        {key: 'amp', name: 'Amp', values: {a: 0.01, d: 0.15, s: 0.5, r: 0.5}},
        {key: 'filter', name: 'Fil', values: {a: 0.01, d: 0.15, s: 0.5, r: 0.5}},
    ],
    subtractive: [
        {key: 'amp', name: 'Amp', values: {a: 0.01, d: 0.15, s: 0.5, r: 0.5}},
        {key: 'filter', name: 'Fil', values: {a: 0.01, d: 0.15, s: 0.5, r: 0.5}},
    ],
}

export const envelopes = writable(instrumentEnvelopes.synth);

export const setEnvelopes = (instrument: 'synth' | 'granular' | 'subtractive') => {
    envelopes.set(instrumentEnvelopes[instrument]);
}

envelopes.subscribe((value) => {
    console.log(value);
})