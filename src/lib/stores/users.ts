import { get, writable, derived } from 'svelte/store';
import type { User } from '$lib/types';
import { colours } from '$lib/utils/utils';

export const id = writable<number | undefined>(undefined);
export const username = writable('Quanta55');
export const location = writable('The Quantum Realm');

export const users = writable<User[]>([
    { id: 1, username: 'User 1', location: 'Location1', x: 0.5, y: 0.235, z: 0, isActive: false, isConnected: false },
    { id: 2, username: 'User 2', location: 'Location2', x: 0.3, y: 0.8, z: 0, isActive: true, isConnected: true },
    { id: 3, username: 'User 3', location: 'Location3', x: 0.1, y: 0.6, z: 0, isActive: true, isConnected: false },
    { id: 4, username: 'User 4', location: 'Location4', x: 0.9, y: 0.4, z: 0, isActive: false, isConnected: true },
    { id: 5, username: 'User 5', location: 'Location5', x: 0.7, y: 0.2, z: 0, isActive: true, isConnected: false },
    { id: 6, username: 'User 6', location: 'Location6', x: 0.2, y: 0.9, z: 0, isActive: false, isConnected: true },
    { id: 7, username: 'User 7', location: 'Location7', x: 0.4, y: 0.7, z: 0, isActive: false, isConnected: false },
    { id: 8, username: 'User 8', location: 'Location8', x: 0.6, y: 0.1, z: 0, isActive: true, isConnected: true },
    { id: 9, username: 'User 9', location: 'Location9', x: 0.8, y: 0.3, z: 0, isActive: false, isConnected: false },
    { id: 10, username: 'User 10', location: 'Location10', x: 0.235, y: 0.5, z: 0, isActive: false, isConnected: true }
]);

export const connectedUsers = derived(users, ($users) => 
    $users.filter(user => user.isConnected)
        .map((user, i) => ({ ...user, colour: colours[(i+1) % colours.length] }))
);
export const otherUsers = derived(users, ($users) => $users.filter(user => !user.isConnected));

export const getUserColour = (userID: string | number) => {
    if (userID === 'you') return 'var(--color-theme-1)';
    return get(connectedUsers).find(user => user.id === +userID)?.colour || 'var(--color-grey-darker)';
}