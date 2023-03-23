import { writable, get } from 'svelte/store';

interface Socket {
    id: string;
    type: 'local' | 'remote';
    colour: string;
    offset: number;
    active: boolean;
    x: number;
    y: number;
    width: number;
}

type Connection = [string, string];

export const sockets = writable({} as {[key: string]: Socket[]});
export const connections = writable([] as Connection[]);

export const activateSocket = (id: string) => {
    sockets.update((s: {[key: string]: Socket[]}) => Object.keys(s).reduce((sockets, socketId: string) => ({
        ...sockets,
        [socketId]: {...s[socketId], active: socketId === id}
    }), {}));
}

export const deactivateSockets = () => {
    sockets.update((s: {[key: string]: Socket[]}) => Object.keys(s).reduce((sockets, socketId) => ({
        ...sockets,
        [socketId]: {...s[socketId], active: false}
    }), {}));
}

export const connectSockets = (a: Socket, b: Socket) => {
    // Don't connect sockets of the same type
    if(a.type === b.type) return

    // Disconnect origin sockets, which have a one to one connection
    [a,b].forEach(socket => {
        if(socket.type === 'remote') return
        connections.update(prev => prev.filter(c => c[0] !== socket.id && c[1] !== socket.id));
    })

    // Connect sockets
    connections.update((prev: Connection[]) => {
        const connection = [a.id, b.id].sort((a, b) => a.localeCompare(b)) as Connection;
        return [...prev, connection]
    })
}

export const disconnectSocket = (id: string) => {
    connections.update(prev => prev.filter(c => c[0] !== id && c[1] !== id));
};

export const initialiseConnections = (groupA: string[], groupB: string[]) => {
    // remove all connections
    connections.set([]);

    // connect sockets
    groupA.forEach((a, i) => {
        const b = groupB[Math.floor(i / (groupA.length / groupB.length))];
        connections.update((prev: Connection[]) => {
            const connection = [a, b].sort((a, b) => a.localeCompare(b)) as Connection;
            return [...prev, connection]
        })
    })
}

export const getConnections = (id: string) => {
    let all = get(connections)
    return all.filter(c => c[0] === id || c[1] === id).map(c => c[0] === id ? c[1] : c[0]);
}