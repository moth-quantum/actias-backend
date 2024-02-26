import { writable, derived, type Readable } from 'svelte/store';
import type { Envelope } from '$lib/types';

export const envelopes= writable<Envelope[]>([
    {key: 'amp', name: 'Amp', a: 0.01, d: 0.15, s: 0.5, r: 0.125},
    {key: 'mod', name: 'Mod', a: 0.01, d: 0.15, s: 0.5, r: 0.125}
]);

export const envelopeValues: Readable<{[key: string]: number}> = derived(
    envelopes,
    ($envelopes) => ({
        a: Math.floor($envelopes[0].a * 1000),
        d: Math.floor($envelopes[0].d * 1000),
        s: $envelopes[0].s,
        r: Math.floor($envelopes[0].r * 1000),
        a1: Math.floor($envelopes[1].a * 1000),
        d1: Math.floor($envelopes[1].d * 1000),
        s1: $envelopes[1].s,
        r1: Math.floor($envelopes[1].r * 1000),
    })
)

export function updateEnvelopeValue(i: number, key: string, value: number) {
    envelopes.update((envelopes: Envelope[]) => {
        envelopes[i][key] = value
        return envelopes
    })
}