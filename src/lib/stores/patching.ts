import { writable, get } from 'svelte/store';
import type { Socket, Connection } from '$lib/types';

export const sockets = writable({} as {[key: string]: Socket});
export const connections = writable([] as Connection[]);

export const redrawCables = (ms = 1) => {
    setTimeout(() => {
        document.dispatchEvent(new CustomEvent('redrawCables'));
    }, ms);
}

export const activateSocket = (id: string) => {
    sockets.update((s: {[key: string]: Socket}) => Object.keys(s).reduce((sockets, socketId: string) => ({
        ...sockets,
        [socketId]: {...s[socketId], active: socketId === id}
    }), {}));
}

export const deactivateSockets = () => {
    sockets.update((s: {[key: string]: Socket}) => Object.keys(s).reduce((sockets, socketId) => ({
        ...sockets,
        [socketId]: {...s[socketId], active: false}
    }), {}));
}

export const connectSockets = (a: Socket, b: Socket) => {
    // Don't connect sockets of the same type
    if(a.type === b.type) return
    

    // Disconnect origin sockets, which have a one to one connection
    [a,b].forEach(socket => {
        // ignore remote sockets
        if(socket.type === 'remote') return
        // filter out origin sockets 
        connections.update(connections => connections.filter(c => c[0] !== socket.id && c[1] !== socket.id));
    })

    // Connect sockets
    connections.update((connections: Connection[]) => {
        // sort by type so there is only one way of storing a connection
        const connection = [a,b].sort(a => a.type === 'remote' ? 1 : -1).map(({id}) => id) as Connection;
        return [...connections, connection]
    })
}

export const disconnectSocket = (id: string) => {
    connections.update(connections => connections.filter(c => c[0] !== id && c[1] !== id));
};

export const initialiseConnections = (originSockets: string[], remoteSockets: string[]) => {
    // remove all connections
    connections.set([]);

    // connect sockets
    originSockets.forEach((a, i) => {
        const b = remoteSockets[Math.floor(i / (originSockets.length / remoteSockets.length))];
        connections.update((connections: Connection[]) => {
            const connection = [a, b] as Connection;
            return [...connections, connection]
        })
    })
}

export const getConnections = (id: string) => {
    let all = get(connections)
    return all.filter(c => c[0] === id || c[1] === id).map(c => c[0] === id ? c[1] : c[0]);
}

export const randomiseConnections = () => {
    // disconnect all sockets
    connections.set([]);
    // split sockets by type
    const all = get(sockets);
    const originSockets = Object.values(all).filter(s => s.type === 'origin');
    const remoteSockets = Object.values(all).filter(s => s.type === 'remote');
    // for each local socket, create a connection where the other socket is a random remote socket (x, y, z)
    originSockets.forEach((socket: Socket) => {
        const randomSocket = remoteSockets[Math.floor(Math.random() * remoteSockets.length)];
        connectSockets(socket, randomSocket);
    })
}