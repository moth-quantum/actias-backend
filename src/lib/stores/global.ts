import { writable, readable, get } from 'svelte/store';

export const volume = writable(0.5);

export const mute = writable(false);

export const fullscreen = writable(false);

export function isApp() {
    return !!window.isApp;
}