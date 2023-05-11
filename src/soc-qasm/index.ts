import { io } from 'socket.io-client';
import { collapse, isMeasuring } from '$lib/stores/qubit';
import { addToast } from '$lib/stores/toasts';

export const socket = io("https://soc-qasm.cephasteom.co.uk", {
    timeout: 20000,
    reconnectionAttempts: 1,
    transports: ['polling']
})

socket.on('connect', () => {
    addToast('Qasm server: connected', 'success')
})

socket.on('disconnect', () => addToast('Qasm server was disconnected', 'error'))
socket.on("connect_error", err => addToast('Qasm server: ' + err.message, 'error'))

function handleError(message: string) {
    console.log(message)
    isMeasuring.set(false);
    addToast(message, 'error');
}

socket.on('response', ([type, message]) => {
    type === 'info' && addToast(message, 'success');
    type === 'error' && handleError(message);
    type === 'counts' && collapse(+message[0]);
});

export function sendQasm(theta: number, phi: number, lambda: number, backend: string, password: string) {
    const qasm = `OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[1];\ncreg c[1];\nu(${theta * Math.PI},${phi * Math.PI},${lambda * Math.PI}) q[0];\nmeasure q[0] -> c[0];\n`
    socket.emit('QuTune', password, qasm, 1, backend)
}