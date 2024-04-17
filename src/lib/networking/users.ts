import { get } from 'svelte/store';
import { id } from '$lib/stores/profile';
import { users } from '$lib/stores/users';
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
    .then((data) => {
        users.set(data.users.map((user: any) => {
            return {
                id: user.id,
                name: user.name,
                location: user.location,
                x: 0,
                y: 0,
                z: 0,
                isActive: user.isActive,
                isConnected: user.isConnected
            }
        }))
    })
}