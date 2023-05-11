import { io } from 'socket.io-client';
import { collapse } from '$lib/stores/qubit';
import { addToast } from '$lib/stores/toasts';

export const socket = io("http://soc-qasm.cephasteom.co.uk", {
    reconnectionAttempts: 1,
    transports: ['polling']
})
console.log(socket)

socket.on('connect', () => {
    addToast('Connected to qasm server')
})

socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`, err);
});
socket.on('disconnect', () => addToast('Qasm server was disconnected'))
socket.on('response', ([type, message]) => {
    (type === 'info' || type === 'error') && addToast(message);
    type === 'counts' && collapse(+message[0]);
});

export function sendQasm(theta: number, phi: number, lambda: number, backend: string, password: string) {
    const qasm = `OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[1];\ncreg c[1];\nu(${theta * Math.PI},${phi * Math.PI},${lambda * Math.PI}) q[0];\nmeasure q[0] -> c[0];\n`
    socket.emit('QuTune', password, qasm, 1, backend)
}