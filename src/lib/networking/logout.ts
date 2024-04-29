import { get } from 'svelte/store';
import { id } from '$lib/stores/profile';
import { apiDomain, headers } from './config';

export const logout = () => {
    const endpoint = `/api/app-user/${get(id)}/logout`

    return fetch(`${get(apiDomain)}${endpoint}`, {
        headers: get(headers),
        method: 'GET'
    }).then((response) => {
        console.log(response)
    })
}