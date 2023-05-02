import { io } from 'socket.io-client';

export const socket = io("http://soc-qasm.cephasteom.co.uk");

console.log(socket)

socket.on("connect", () => {
    console.log("connected to server",socket.id);
});
socket.on("disconnect", () => {
    console.log("server disconnected",socket.id);
});

