import { writable } from 'svelte/store';

export const id = writable(0);
export const name = writable('');
export const location = writable('');

export const isLoggedIn = writable(false);