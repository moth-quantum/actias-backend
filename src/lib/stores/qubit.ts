import { writable } from 'svelte/store';

export interface Axis {
    key: string;
    name: string;
    value: number;
    min: number;
    max: number;
    step: number;
    colour: string;
}

export const axes = writable<Axis[]>([
    {key: 'x', name: 'λ', value: 0, min: 0, max: 1, step: 0.001, colour: '#00A399'},
    // phi
    {key: 'y', name: 'φ', value: 0, min: 0, max: 1, step: 0.001, colour: '#E5007F'},
    // theta
    {key: 'z', name: 'θ', value: 0, min: 0, max: 1, step: 0.001, colour: '#FF695A'},
]);
