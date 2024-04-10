import { writable, get, derived } from 'svelte/store';
import { mapToRange, clamp } from '../utils/utils';
import type { Axis } from '../types';
import { add } from '../utils/utils';
import { redrawCables } from './patching';
import { disconnectSocket } from './patching';
import { circuit } from './circuit';

export const qubits = writable<{active: boolean, user: 'you' | number, axes: Axis[]}[]>(
    Array(12).fill(null).map((_, i) => ({
        active: i < 2, 
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

// Handle redraw events for individual qubits
let previousQubitsStates = get(qubits).map(q => q.axes.map(a => a.value));
qubits.subscribe((qubits) => {
    const newQubitsStates = qubits.map(q => q.axes.map(a => a.value));
    
    // needs to work out all qubits that have changed, not just the first one...
    const changedQubits: number[] = newQubitsStates
        .map((qubit, i) => {
            return qubit.reduce(add) !== previousQubitsStates[i].reduce(add)
                ? i
                : -1;
        })
        .filter(q => q !== -1);

    previousQubitsStates = newQubitsStates;

    
    
    // Fire a redraw event with the index of the qubit to be redrawn
    // This prevents all qubits from being redrawn each time a single qubit changes
    if(typeof document === 'undefined') return
    changedQubits.forEach((changedQubitIndex: number) => {
        console.log(changedQubitIndex)
        const redrawEvent = new CustomEvent('redrawQubit', { detail: changedQubitIndex });
        document.dispatchEvent(redrawEvent);
    })
});

const u3Params = (theta: number, phi: number, lambda: number) => {
    return {
        params: {
            theta: theta * Math.PI,
            phi: phi * Math.PI,
            lambda: lambda * Math.PI
        }
    }
}

// handle circuit updates when qubits change
qubits.subscribe((qubits) => {
    qubits.forEach((q, i) => {
        q.active
            ? circuit.addGate("u3", 0, i, u3Params(q.axes[2].value, q.axes[1].value, q.axes[0].value))
            : circuit.removeQubit(i);
    })
})

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
    circuit.run();
    if(get(source) === 'local') {
        return collapse(circuit.measureAll());
    }

    // const backend = get(source);
    // TODO: export qasm and send to our new API...
}

export function collapse(destinations: number[]) {
    const startTime = new Date().getTime();
    const endTime = startTime + (get(collapseTime) * 1000);

    const startValues: {[key: string]: number}[] = destinations.map((_, i) => {
        return {
            x: get(qubits)[i].axes[0].value, 
            y: get(qubits)[i].axes[1].value, 
            z: get(qubits)[i].axes[2].value, 
        }
    })

    const endValues: {[key: string]: number}[] = destinations.map(dest => ({x: 0, y: 0, z: dest}));

    const interval = setInterval(() => {
        const now = new Date().getTime();
        const progress = (now - startTime) / (endTime - startTime);
        if (progress > 1) {
            clearInterval(interval);
            isMeasuring.set(false);
        }
        qubits.update(qs => {
            return qs.map((q, i) => {
                if (destinations.length > i) {
                    return {
                        ...q,
                        axes: q.axes.map(axis => ({
                            ...axis, 
                            value: clamp(
                                mapToRange(progress, 0, 1, startValues[i][axis.key], endValues[i][axis.key]),
                                0, 1
                            )
                        }))
                    }
                }
                return q;
            })
        });
    }, 10);
}