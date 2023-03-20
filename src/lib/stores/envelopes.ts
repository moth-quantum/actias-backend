import { writable } from 'svelte/store';

interface Envelope {
    key: string;
    name: string;
    values: {
        att: number;
        dec: number;
        sus: number;
        rel: number;
    }
}


const instrumentEnvelopes: {[key: string]: Envelope[]} = {
    fm: [
        {key: 'amp', name: 'Amp', values: {att: 0.01, dec: 0.15, sus: 0.5, rel: 0.5}},
        {key: 'modulation', name: 'Mod', values: {att: 0.01, dec: 0.15, sus: 0.5, rel: 0.5}},
    ],
    granular: [
        {key: 'amp', name: 'Amp', values: {att: 0.01, dec: 0.15, sus: 0.5, rel: 0.5}},
        {key: 'filter', name: 'Fil', values: {att: 0.01, dec: 0.15, sus: 0.5, rel: 0.5}},
    ],
    subtractive: [
        {key: 'amp', name: 'Amp', values: {att: 0.01, dec: 0.15, sus: 0.5, rel: 0.5}},
        {key: 'filter', name: 'Fil', values: {att: 0.01, dec: 0.15, sus: 0.5, rel: 0.5}},
    ],
}

export const envelopes = writable(instrumentEnvelopes.fm);

export const setEnvelopes = (instrument: 'fm' | 'granular' | 'subtractive') => {
    envelopes.set(instrumentEnvelopes[instrument]);
}