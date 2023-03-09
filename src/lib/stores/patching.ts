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
    // Don't connect sockets of the same type
    if(a.type === b.type) return

    // Disconnect local socket
    [a,b].forEach(socket => {
        if(socket.type === 'remote') return
        connections.update(prev => prev.filter(c => c[0] !== socket.id && c[1] !== socket.id));
    })

    // Connect sockets
    connections.update(prev => [...prev, [a.id, b.id].sort((a, b) => a.localeCompare(b))])
    
}

export const disconnectSocket = (id) => {
    connections.update(prev => prev.filter(c => c[0] !== id && c[1] !== id));
}