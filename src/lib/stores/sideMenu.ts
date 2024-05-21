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
    { name: 'controls', image: keyboard, isVisible: true, isActive: true, hasSubMenu: false},
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

export const controlsAreVisible = derived(
    menuItems,
    $menuItems => {
        return $menuItems.find(item => item.name === 'controls')?.isActive
    }
);

export const showControls = () => {
    menuItems.update(items => {
        return items.map((item) => ({
            ...item,
            isActive: item.name === 'controls' ? true : item.isActive
        }), {});
    });
}

export const hideControls = () => {
    menuItems.update(items => {
        return items.map((item) => ({
            ...item,
            isActive: item.name === 'controls' ? false : item.isActive
        }), {});
    });
}

export const toggleControls = () => {
    menuItems.update(items => {
        return items.map((item) => ({
            ...item,
            isActive: item.name === 'controls' ? !item.isActive : item.isActive
        }), {});
    });
}

export const performanceMode = derived(
    menuItems,
    $menuItems => {
        return $menuItems.find(item => item.name === 'perform')?.isActive
    }
);

export const hidePerformanceMode = () => {
    menuItems.update(items => {
        return items.map((item) => ({
            ...item,
            isActive: item.name === 'perform' ? false : item.isActive
        }), {});
    });
}