// @ts-nocheck
import { writable } from 'svelte/store';

export const sockets = writable({});
export const connections = writable([]);

export const activateSocket = (id) => {
    sockets.update(s => Object.keys(s).reduce((sockets, socketId) => ({
        ...sockets,
        [socketId]: {...s[socketId], active: socketId === id}
    }), {}));
}

export const deactivateSockets = () => {
    sockets.update(s => Object.keys(s).reduce((sockets, socketId) => ({
        ...sockets,
        [socketId]: {...s[socketId], active: false}
    }), {}));
}

export const connectSockets = (a, b) => {
    connections.update(prev => {
        const connection = [a, b].sort((a, b) => a.localeCompare(b));
        const exists = prev.find(c => c[0] === connection[0] && c[1] === connection[1]);
        return exists ? prev : [...prev, connection];
    });
}

export const disconnectSocket = (id) => {
    connections.update(prev => prev.filter(c => c[0] !== id && c[1] !== id));
}