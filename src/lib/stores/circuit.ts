import { get, readable } from 'svelte/store';
import { qubits } from './qubits';
// @ts-ignore
import QuantumCircuit from 'quantum-circuit/dist/quantum-circuit.min.js';

export const circuit = new QuantumCircuit();
console.log(circuit)

const u3Params = (theta: number, phi: number, lambda: number) => {
    return {
        params: {
            theta: theta * (Math.PI/2),
            phi: phi * (Math.PI/2),
            lambda: lambda * (Math.PI/2)
        }
    }
}

qubits.subscribe((qubits) => {
    qubits.forEach((q, i) => {
        q.active
            ? circuit.addGate("u3", 0, i, u3Params(q.axes[2].value, q.axes[1].value, q.axes[0].value))
            : circuit.removeQubit(i);
    })
})

export interface Gate {
    name: string;
    symbol: string;
    qubits: number;
    description: string;
    params: {
        name: string;
        type: string;
        default: any;
    }[]
}
// TODO: update copy
export const gates = readable<Gate[]>([
    {
        name: 'Pauli X',
        symbol: 'x',
        qubits: 1,
        description: 'PI rotation over x-axis. Also known as "NOT" gate.',
        params: []
    },
    {
        name: 'Pauli Y',
        symbol: 'y',
        qubits: 1,
        description: 'PI rotation over y-axis.',
        params: []
    },
    {
        name: 'Pauli Z',
        symbol: 'z',
        qubits: 1,
        description: 'PI rotation over z-axis.',
        params: []
    },
    {
        name: 'Hadamard',
        symbol: 'h',
        qubits: 1,
        description: 'PI/2 rotation over x-axis.',
        params: []
    },    
    {
        name: 'CNOT',
        symbol: 'cx',
        qubits: 2,
        description: 'Controlled NOT gate. Requires two qubits.',
        params: []
    },
    {
        name: 'CCNOT',
        symbol: 'ccx',
        qubits: 3,
        description: 'Toffoli gate. Requires three qubits.',
        params: []
    },
    {
        name: 'CZ',
        symbol: 'cz',
        qubits: 3,
        description: 'Controlled Z gate (controlled rotation over z-axis by PI). Requires three qubits.',
        params: []
    },
    {
        name: 'RX',
        symbol: 'rx',
        qubits: 1,
        description: 'Controlled rotation around the x-axis by given angle.',
        params: [
            {
                name: 'theta',
                type: 'number',
                default: 0
            }
        ]
    },
    {
        name: 'RY',
        symbol: 'ry',
        qubits: 1,
        description: 'Controlled rotation around the y-axis by given angle.',
        params: [
            {
                name: 'theta',
                type: 'number',
                default: 0
            }
        ]
    },
    {
        name: 'RZ',
        symbol: 'rz',
        qubits: 1,
        description: 'Controlled rotation around the z-axis by given angle.',
        params: [
            {
                name: 'phi',
                type: 'number',
                default: 0
            }
        ]
    },
    {
        name: 'U3',
        symbol: 'u3',
        qubits: 1,
        description: 'Controlled rotation around the x, y, and z-axis by given angles.',
        params: [
            {
                name: 'theta',
                type: 'number',
                default: 0
            },
            {
                name: 'phi',
                type: 'number',
                default: 0
            },
            {
                name: 'lambda',
                type: 'number',
                default: 0
            }
        ]
    }
])