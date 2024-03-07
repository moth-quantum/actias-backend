import { writable } from 'svelte/store';
import initElectronAPI from '$lib/electronAPI';

export const volume = writable(0.5);

export const mute = writable(false);

export const fullscreen = writable(false);

export const isApp: () => boolean = () => {
    return !!window.isApp;
}

isApp() && initElectronAPI();
