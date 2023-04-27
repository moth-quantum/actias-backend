import { writable, derived, type Readable } from 'svelte/store';
import type { Envelope } from '$lib/types';

export const envelopes= writable<Envelope[]>([
    {key: 'amp', name: 'Amp', a: 0.01, d: 0.15, s: 0.5, r: 0.125},
    {key: 'mod', name: 'Mod', a: 0.01, d: 0.15, s: 0.5, r: 0.125}
]);

export const envelopeValues: Readable<{[key: string]: number}> = derived(
    envelopes,
    ($envelopes) => ({
        a: $envelopes[0].a * 1000,
        d: $envelopes[0].d * 1000,
        s: $envelopes[0].s,
        r: $envelopes[0].r * 4000,
        a1: $envelopes[1].a * 1000, 
        d1: $envelopes[1].d * 1000,
        s1: $envelopes[1].s,
        r1: $envelopes[1].r * 4000,
    })
)