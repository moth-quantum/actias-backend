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
    fm: [
        {key: 'amp', name: 'Amplitude Envelope', values: {a: 0.01, d: 0.15, s: 0.5, r: 0.5}},
        {key: 'modulation', name: 'Modulation Envelope', values: {a: 0.01, d: 0.15, s: 0.5, r: 0.5}},
    ],
    granular: [
        {key: 'amp', name: 'Amplitude Envelope', values: {a: 0.01, d: 0.15, s: 0.5, r: 0.5}},
        {key: 'filter', name: 'Filter Envelope', values: {a: 0.01, d: 0.15, s: 0.5, r: 0.5}},
    ],
    subtractive: [
        {key: 'amp', name: 'Amplitude Envelope', values: {a: 0.01, d: 0.15, s: 0.5, r: 0.5}},
        {key: 'filter', name: 'Filter Envelope', values: {a: 0.01, d: 0.15, s: 0.5, r: 0.5}},
    ],
}

export const envelopes = writable(instrumentEnvelopes.fm);

export const setEnvelopes = (instrument: 'fm' | 'granular' | 'subtractive') => {
    envelopes.set(instrumentEnvelopes[instrument]);
}