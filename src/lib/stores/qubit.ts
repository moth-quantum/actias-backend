import { writable, get, derived } from 'svelte/store';
import { mapToRange, clamp } from '../utils/utils';

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
    {key: 'x', name: 'λ', value: 0.5, min: 0, max: 1, step: 0.001, colour: '#00A399'},
    // phi
    {key: 'y', name: 'φ', value: 1, min: 0, max: 1, step: 0.001, colour: '#E5007F'},
    // theta
    {key: 'z', name: 'θ', value: 0, min: 0, max: 1, step: 0.001, colour: '#FF695A'},
]);

export const seconds = writable<number>(0);
export const bpm = writable<number>(0);
export const beats = writable<number>(0);
export const source = writable<string>('local');
export const password = writable<string>('');

export const collapseTime = derived([seconds, bpm, beats], ([$seconds, $bpm, $beats]) => {
    if ($bpm > 0 && $beats > 0) return 60 / $bpm * $beats;
    if ($seconds) return $seconds;
    return 1;
});

export const measure = () => {
    const theta = get(axes)[2].value;
    
    get(source) === 'local'
        ? collapse((Math.random() < theta) ? 1 : 0, get(collapseTime))
        : 0; // TODO: remote measurement
}

function collapse(dest: 0 | 1, seconds: number) {
    const currentAxes = get(axes);
    
    const startTime = new Date().getTime();
    const endTime = startTime + (seconds * 1000);
    
    const startValues: {[key: string]: number} = {
        x: currentAxes[0].value, 
        y: currentAxes[1].value, 
        z: currentAxes[2].value
    }

    const endValues: {[key: string]: number} = {x: 0, y: 0, z: dest}

    const interval = setInterval(() => {
        const now = new Date().getTime();
        const progress = (now - startTime) / (endTime - startTime);
        if (progress > 1) clearInterval(interval);
        axes.update(a => {
            return a.map(axis => ({
                ...axis, 
                value: clamp(
                    mapToRange(progress, 0, 1, startValues[axis.key], endValues[axis.key]),
                    0, 1
                )
            }));
        });
    }, 10);
}