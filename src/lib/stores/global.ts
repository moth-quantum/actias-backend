import { writable, get } from 'svelte/store';

export const volume = writable(0.5);

export const mute = writable(false);

export const fullscreen = writable(false);

// @ts-ignore
export const isApp = writable(!!window.isApp); // used for conditional functionality between web and app