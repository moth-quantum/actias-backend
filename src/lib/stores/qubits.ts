import { writable, get, derived } from 'svelte/store';
import { tweened, type Tweened } from 'svelte/motion';
import { mapToRange, clamp } from '../utils/utils';
import { redrawCables } from './patching';
import { disconnectSocket } from './patching';
import { circuit } from './circuit';
    
export const qubits = writable<{active: boolean, user: 'you' | number}[]>(
    Array(12).fill(null).map((_, i) => ({active: i === 0, user: 'you'}))
);

export const focusedQubit = writable<number>(0);

export const axes: Tweened<number[]>[] = Array(12).fill(null).map(() => tweened([0,0,0], {
    duration: 100,
}));

export const axesValues = derived(
    [...axes], 
    ([$a0, $a1, $a2, $a3, $a4, $a5, $a6, $a7, $a8, $a9, $a10, $a11]) => {
        return [
            $a0, $a1, $a2, $a3, $a4, $a5, $a6, $a7, $a8, $a9, $a10, $a11
        ]
    })

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

const u3Params = (theta: number, phi: number, lambda: number) => {
    return {
        params: {
            theta: theta * Math.PI,
            phi: phi * Math.PI,
            lambda: lambda * Math.PI
        }
    }
}

export const initGates = (i: number, theta: number = 0, phi: number = 0, lambda: number = 0) => {
    circuit.addGate("u3", 0, i, u3Params(theta, phi, lambda))
}

// handle circuit updates when qubits change
qubits.subscribe((qubits) => {
    qubits.forEach((q, i) => {
        q.active
            ? initGates(i, get(axes[i])[2], get(axes[i])[1], get(axes[i])[0])
            : circuit.removeQubit(i);
    })
})

// handle circuit updates when axes change
axes.forEach((store, i) => {
    store.subscribe((arr) => {
        initGates(i, arr[2], arr[1], arr[0]);
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
    isMeasuring.set(true);
    const startTime = new Date().getTime();
    const endTime = startTime + (get(collapseTime) * 1000);
    const startValues: number[][] = destinations.map((_, i) => get(axes[i]));

    const endValues: number[][] = destinations.map(dest => [0,0,dest]);

    console.log(startValues, endValues)

    const interval = setInterval(() => {
        const now = new Date().getTime();
        const progress = (now - startTime) / (endTime - startTime);
        if (progress > 1) {
            clearInterval(interval);
            isMeasuring.set(false);
        }
        
            axes.forEach((store, qubit) => {
                if (destinations.length <= qubit) return;
                store.update((arr) => {
                    return arr.map((_,axis) => clamp(
                        mapToRange(progress, 0, 1, startValues[qubit][axis], endValues[qubit][axis]),
                        0, 1
                    ))
                });
            });
    }, 100);
}