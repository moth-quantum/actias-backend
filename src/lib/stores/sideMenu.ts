import { writable, derived } from 'svelte/store';
import { isApp } from '$lib/stores/global';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faGlobe, faUser, faUsers, faCircle, faCircleQuestion, faGear, faPlay } from '@fortawesome/free-solid-svg-icons';
library.add(faGlobe, faUser, faUsers, faCircle, faCircleQuestion, faGear, faPlay);

export const menuItems = writable([
    { name: 'profile', icon: faUser, isVisible: true, isActive: false, hasSubMenu: true },
    { name: 'assign qubits', icon: faGlobe, isVisible: true, isActive: false, hasSubMenu: true },
    { name: 'connect', icon: faUsers, isVisible: isApp(), isActive: false, hasSubMenu: true },
    { name: 'midi', icon: faCircle, isVisible: true, isActive: false, hasSubMenu: true },
    { name: 'control', icon: faGear, isVisible: true, isActive: false, hasSubMenu: false },
    { name: 'tooltips', icon: faCircleQuestion, isVisible: true, isActive: false, hasSubMenu: false },
    { name: 'perform', icon: faPlay, isVisible: true, isActive: false, hasSubMenu: false }
]);

export const activeSubMenu = derived(
    menuItems, 
    $menuItems => {
        const item = $menuItems.find(item => item.hasSubMenu && item.isActive)
        return item ? item.name : null
    }
);