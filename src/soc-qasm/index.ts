import { io } from 'socket.io-client';

export const socket = io("http://soc-qasm.cephasteom.co.uk");

console.log(socket)

socket.on('connect', () => console.log('connected'))
socket.on('disconnect', () => console.log('disconnected'))
socket.on('response', data => data[0] === 'info' && console.log(data[1]));

export function sendQasm(x: number, y: number, z: number, backend: string, password: string) {
    const qasm = `OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[1];\ncreg c[1];\nu(${(x * Math.PI)/2},${(y * Math.PI)/2},${(z * Math.PI)/2}) q[0];\nmeasure q[0] -> c[0];\n`
    socket.emit('QuTune', [password, qasm, 1, backend])
}