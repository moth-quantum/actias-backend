import { writable } from 'svelte/store';

export const toasts = writable<{message: string, type: string}[]>([]);

export function addToast(message: string, type: string = 'success') {
    toasts.update(toasts => {
        const newToasts = toasts.filter((toast, index, self) => {
            return index === self.findIndex((t) => (
                t.message === toast.message && t.type === toast.type
            ));
        });
        return [...newToasts, {message, type}]
    });
}

export function removeToast(message: string) {
    toasts.update(toasts => toasts.filter(toast => toast.message !== message));
}