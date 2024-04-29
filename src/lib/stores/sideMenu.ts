import { writable, derived } from 'svelte/store';
import { isApp } from '$lib/stores/global';
import keyboard from '$lib/images/keyboard.svg';
import midi from '$lib/images/midi-white.svg';
import { faGlobe, faUser, faUsers, faCircleQuestion, faPlay, faDiagramProject } from '@fortawesome/free-solid-svg-icons';

export const menuItems = writable([
    { name: 'profile', icon: faUser, isVisible: isApp(), isActive: false, hasSubMenu: true},
    { name: 'connect', icon: faUsers, isVisible: isApp(), isActive: false, hasSubMenu: true},
    { name: 'qubits', icon: faGlobe, isVisible: true, isActive: false, hasSubMenu: true},
    { name: 'circuit', icon: faDiagramProject, isVisible: true, isActive: false, hasSubMenu: true},
    { name: 'midi', image: midi, isVisible: true, isActive: false, hasSubMenu: true},
    { name: 'keyboard', image: keyboard, isVisible: true, isActive: true, hasSubMenu: false},
    { name: 'tooltips', icon: faCircleQuestion, isVisible: true, isActive: false, hasSubMenu: false},
    { name: 'perform', icon: faPlay, isVisible: true, isActive: false, hasSubMenu: false }
]);

export const activeSubMenu = derived(
    menuItems, 
    $menuItems => {
        const item = $menuItems.find(item => item.hasSubMenu && item.isActive)
        return item ? item.name : null
    }
);