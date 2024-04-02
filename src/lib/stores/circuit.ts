import { readable } from 'svelte/store';
// @ts-ignore
import QuantumCircuit from 'quantum-circuit/dist/quantum-circuit.min.js';

export const circuit = new QuantumCircuit();

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
        description: 'Controlled NOT gate.',
        params: []
    },
    {
        name: 'CCNOT',
        symbol: 'ccx',
        qubits: 3,
        description: 'Toffoli gate.',
        params: []
    },
    {
        name: 'CZ',
        symbol: 'cz',
        qubits: 3,
        description: 'Controlled Z gate (controlled rotation over z-axis by PI).',
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
])