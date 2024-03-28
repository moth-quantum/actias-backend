import { writable, derived } from 'svelte/store';
import { isApp } from '$lib/stores/global';
import { library } from '@fortawesome/fontawesome-svg-core';
import keyboard from '$lib/images/keyboard.svg';
import midi from '$lib/images/midi-white.svg';
import { faGlobe, faUser, faUsers, faCircleQuestion, faGear, faPlay } from '@fortawesome/free-solid-svg-icons';
library.add(faGlobe, faUser, faUsers, faCircleQuestion, faGear, faPlay);

export const menuItems = writable([
    { name: 'profile', icon: faUser, isVisible: isApp(), isActive: false, hasSubMenu: true, link: '' },
    // { name: 'assign', icon: faGlobe, isVisible: isApp(), isActive: false, hasSubMenu: true, link: '' },
    { name: 'assign', icon: faGlobe, isVisible: true, isActive: false, hasSubMenu: true, link: '' },
    { name: 'connect', icon: faUsers, isVisible: isApp(), isActive: false, hasSubMenu: true, link: '' },
    { name: 'circuit', icon: faGlobe, isVisible: true, isActive: false, hasSubMenu: false, link: '/circuit-designer' },
    // { name: 'connect', icon: faUsers, isVisible: true, isActive: false, hasSubMenu: true, link: '' },
    { name: 'midi', image: midi, isVisible: true, isActive: false, hasSubMenu: true, link: '' },
    { name: 'keyboard', image: keyboard, isVisible: true, isActive: true, hasSubMenu: false, link: '' },
    { name: 'tooltips', icon: faCircleQuestion, isVisible: true, isActive: false, hasSubMenu: false, link: '' },
    { name: 'perform', icon: faPlay, isVisible: true, isActive: false, hasSubMenu: false, link: '' }
]);

export const activeSubMenu = derived(
    menuItems, 
    $menuItems => {
        const item = $menuItems.find(item => item.hasSubMenu && item.isActive)
        return item ? item.name : null
    }
);