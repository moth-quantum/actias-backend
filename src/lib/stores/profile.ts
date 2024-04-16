import { writable } from 'svelte/store';

export const id = writable<number | undefined>(undefined);
export const name = writable('');
export const location = writable('');