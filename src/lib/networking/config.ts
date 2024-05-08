import { writable, derived } from 'svelte/store';

export const apiDomain = writable('');
export const apiWsDomain = writable('');
export const apiToken = writable('');
export const pusherKey = writable('');

export const headers = derived([apiToken], ([$apiToken]) => {
    return {
        'Authorization' : `Bearer ${$apiToken}`,
        'Content-Type': 'application/json',
    }
})