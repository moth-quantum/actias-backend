import { writable } from 'svelte/store';
import { redrawCables } from '$lib/stores/patching';
import initElectronAPI from '$lib/electronAPI';

export const volume = writable(0.5);

export const mute = writable(false);

export const fullscreen = writable(false);

export const isApp: () => boolean = () => {
    return typeof window !== 'undefined' && !!window.isApp;
}

export const showKeyboard = writable(true);
showKeyboard.subscribe(() => redrawCables());
export const toggleKeyboard = () => {
    showKeyboard.update(value => !value)
};

export const showSideMenu = writable(true);
showSideMenu.subscribe(() => redrawCables());

isApp() && initElectronAPI();
