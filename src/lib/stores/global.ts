import { writable } from 'svelte/store';

export const volume = writable(0.5);

export const mute = writable(false);