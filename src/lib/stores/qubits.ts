import { writable, get, derived } from 'svelte/store';
import { mapToRange, clamp } from '../utils/utils';
import type { Axis } from '../types';
import { add } from '../utils/utils';
import { redrawCables } from './patching';
import { disconnectSocket } from './patching';

export const qubits = writable<{active: boolean, user: 'you' | number, axes: Axis[]}[]>(
    Array(12).fill(null).map((_, i) => ({
        active: i === 0, 
        user: 'you',
        axes: [
            {key: 'x', name: 'λ', value: 0.5, min: 0, max: 1, step: 0.001, colour: '#00A399'},
            {key: 'y', name: 'φ', value: 1, min: 0, max: 1, step: 0.001, colour: '#E5007F'},
            {key: 'z', name: 'θ', value: 0, min: 0, max: 1, step: 0.001, colour: '#FF695A'}
        ]
    }))
);

export const activeQubitCount = derived(qubits, ($qubits) => {
    return $qubits.filter(q => q.active).length;
});

export const activateQubit = () => {
    const i = get(qubits).findIndex(q => !q.active);
    i !== -1 && qubits.update(qs => {
        qs[i].active = true;
        return qs
    })
    redrawCables();
}

export const deactivateQubit = () => {
    qubits.update(qs => {
        const i = qs.filter(q => q.active).length - 1
        qs[i].active = false;
        // tidy up connections that were connected to this qubit
        ['x', 'y', 'z'].forEach(axis => {
            const key = `${axis}${i}`;
            disconnectSocket(key);
        })
        return qs
    })
    redrawCables();
}

let previousQubitsStates = get(qubits).map(q => q.axes.map(a => a.value));
qubits.subscribe((qubits) => {
    const newQubitsStates = qubits.map(q => q.axes.map(a => a.value));
    
    const changedQubitIndex = newQubitsStates.findIndex((qubit, i) => {
        return qubit.reduce(add) !== previousQubitsStates[i].reduce(add);
    });

    previousQubitsStates = newQubitsStates;

    if (changedQubitIndex === -1) return;
    
    // Fire a redraw event with the index of the qubit to be redrawn
    // This prevents all qubits from being redrawn each time a single qubit changes
    if(typeof document === 'undefined') return
    
    const redrawEvent = new CustomEvent('redrawQubit', { detail: changedQubitIndex });
    document.dispatchEvent(redrawEvent);
});

export const isMeasuring = writable<boolean>(false);
export const seconds = writable<number>();
export const bpm = writable<number>();
export const beats = writable<number>();
export const source = writable<string>('local');
export const password = writable<string>('');
export const token = writable<string>('');

export const collapseTime = derived([seconds, bpm, beats], ([$seconds, $bpm, $beats]) => {
    if ($bpm > 0 && $beats > 0) return 60 / $bpm * $beats;
    if ($seconds) return $seconds;
    return 1;
});

export const measure = () => {
    if (get(isMeasuring)) return;
    isMeasuring.set(true);
    const theta = get(qubits)[0].axes[2].value;
    const phi = get(qubits)[0].axes[1].value;
    const lambda = get(qubits)[0].axes[0].value;
    const backend = get(source);
    
    get(source) === 'local'
        ? collapse((Math.random() < theta) ? 1 : 0)
        : console.log(`send qasm string at this point! using ${backend} backend, with theta: ${theta}, phi: ${phi}, lambda: ${lambda}`);
}

export function collapse(dest: 0 | 1) {
    const currentAxes = get(qubits)[0].axes;
    
    const startTime = new Date().getTime();
    const endTime = startTime + (get(collapseTime) * 1000);
    
    const startValues: {[key: string]: number} = {
        x: currentAxes[0].value, 
        y: currentAxes[1].value, 
        z: currentAxes[2].value
    }

    const endValues: {[key: string]: number} = {x: 0, y: 0, z: dest}

    const interval = setInterval(() => {
        const now = new Date().getTime();
        const progress = (now - startTime) / (endTime - startTime);
        if (progress > 1) {
            clearInterval(interval);
            isMeasuring.set(false);
        }
        qubits.update(qs => {
            qs[0].axes = qs[0].axes.map(axis => ({
                ...axis, 
                value: clamp(
                    mapToRange(progress, 0, 1, startValues[axis.key], endValues[axis.key]),
                    0, 1
                )
            }));
            return qs;
        });
    }, 10);
}