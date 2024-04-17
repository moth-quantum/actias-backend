import { get } from 'svelte/store';
import { id } from '$lib/stores/profile';
import { apiDomain, apiToken } from './config';

export const getUsers = async () => {
    const endpoint = `${apiDomain}/api/app-users/${get(id)}`;
    fetch(endpoint, {
        method: 'GET',
        headers: {
            'Authorization' : `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(({users}) => {
        console.log(users)
    })
}