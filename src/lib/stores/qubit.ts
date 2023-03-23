import { writable } from 'svelte/store';

interface Axis {
    key: string;
    name: string;
    value: number;
    min: number;
    max: number;
    step: number;
    colour: string;
}

export const axes = writable<Axis[]>([
    {key: 'z', name: 'λ', value: 0, min: 0, max: 1, step: 0.001, colour: '#00A399'},
    {key: 'x', name: 'φ', value: 0, min: 0, max: 1, step: 0.001, colour: '#E5007F'},
    {key: 'y', name: 'θ', value: 0, min: 0, max: 1, step: 0.001, colour: '#FF695A'},
]);

axes.subscribe((axes) => {
    // console.log(axes);
})
