// TODO: update copy
export const gates = [
    {
        name: 'Pauli X',
        symbol: 'X',
        qubits: 1,
        description: 'PI rotation over x-axis. Also known as "NOT" gate.',
        params: []
    },
    {
        name: 'Pauli Y',
        symbol: 'Y',
        qubits: 1,
        description: 'PI rotation over y-axis.',
        params: []
    },
    {
        name: 'Pauli Z',
        symbol: 'Z',
        qubits: 1,
        description: 'PI rotation over z-axis.',
        params: []
    },
    {
        name: 'Hadamard',
        symbol: 'H',
        qubits: 1,
        description: 'TODO.',
        params: []
    },    
    {
        name: 'CNOT',
        symbol: 'CX',
        qubits: 2,
        description: 'Controlled NOT gate.',
        params: []
    },
    {
        name: 'CCNOT',
        symbol: 'CCX',
        qubits: 3,
        description: 'Toffoli gate.',
        params: []
    },
    {
        name: 'CZ',
        symbol: 'CZ',
        qubits: 3,
        description: 'Controlled Z gate (controlled rotation over z-axis by PI).',
    },
    {
        name: 'RX',
        symbol: 'RX',
        qubits: 2,
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
        symbol: 'RX',
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
        symbol: 'RX',
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
]