import { writable } from 'svelte/store';
import { isChrome } from '$lib/utils/utils';

export const toasts = writable<{message: string, type: string}[]>([]);

export function addToast(message: string, type: string = 'success') {
    toasts.update(toasts => [...toasts, {message, type}]);
}

export function removeToast(message: string) {
    toasts.update(toasts => toasts.filter(toast => toast.message !== message));
}

isChrome() || addToast('Please use Chrome for optimum performance.', 'warning');