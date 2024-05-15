import { writable } from 'svelte/store';
import { redrawCables } from '$lib/stores/patching';

export const volume = writable(0.5);

export const mute = writable(false);

export const performanceMode = writable(false);

export const isApp: () => boolean = () => {
    return typeof window !== 'undefined' && !!window.isApp;
}

export const showSideMenu = writable(typeof window !== 'undefined' && window.innerWidth > 1200);
showSideMenu.subscribe(() => redrawCables());
