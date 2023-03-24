import { writable, derived, type Readable } from 'svelte/store';

interface Envelope {
    key: string;
    name: string;
    a: number;
    d: number;
    s: number;
    r: number;
}

const instrumentEnvelopes: {[key: string]: Envelope[]} = {
    synth: [
        {key: 'amp', name: 'Amp', a: 0.01, d: 0.15, s: 0.5, r: 0.125},
        {key: 'mod', name: 'Mod', a: 0.01, d: 0.15, s: 0.5, r: 0.125},
    ],
    granular: [
        {key: 'amp', name: 'Amp', a: 0.01, d: 0.15, s: 0.5, r: 0.125},
        {key: 'fil', name: 'Fil', a: 0.01, d: 0.15, s: 1, r: 0.125},
    ],
    subtractive: [
        {key: 'amp', name: 'Amp', a: 0.01, d: 0.15, s: 0.5, r: 0.125},
        {key: 'fil', name: 'Fil', a: 0.01, d: 0.15, s: 1, r: 0.125},
    ],
}

export const envelopes = writable(instrumentEnvelopes.synth);

export const setEnvelopes = (instrument: 'synth' | 'granular' | 'subtractive') => {
    envelopes.set(instrumentEnvelopes[instrument]);
}

export const envelopeValues: Readable<{[key: string]: number}> = derived(
    envelopes,
    $envelopes => ({
        a: $envelopes[0].a * 1000,
        d: $envelopes[0].d * 1000,
        s: $envelopes[0].s,
        r: $envelopes[0].r * 4000,
        [`${$envelopes[1].key}a`]: $envelopes[1].a * 1000, 
        [`${$envelopes[1].key}d`]: $envelopes[1].d * 1000,
        [`${$envelopes[1].key}s`]: $envelopes[1].s,
        [`${$envelopes[1].key}r`]: $envelopes[1].r * 4000,
    })
)