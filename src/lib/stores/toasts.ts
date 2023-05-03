import { writable, get } from 'svelte/store';

export const toasts = writable<{message: string, type: string}[]>([
    // {message: 'Welcome to QuTune!', type: 'info'},
]);

toasts.subscribe(() => setTimeout(() => toasts.set(get(toasts).slice(1)), 3000))

export function addToast(message: string, type: string = 'info') {
    toasts.update(toasts => [...toasts, {message, type}]);
}