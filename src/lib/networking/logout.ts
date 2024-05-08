import { get } from 'svelte/store';
import { id } from '$lib/stores/profile';
import { apiDomain, headers } from './config';
import { addToast } from '$lib/stores/toasts';

export const logout = () => {
    const endpoint = `/api/app-user/${get(id)}/logout`

    return fetch(`${get(apiDomain)}${endpoint}`, {
        headers: get(headers),
        method: 'GET'
    }).then((response) => {
        response.status === 404 && addToast('404: logout', 'warning');
        response.status === 500 && addToast('500: Server error when logging out', 'error');
    })
}