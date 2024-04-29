import { get } from 'svelte/store';
import { id } from '$lib/stores/profile';
import { users } from '$lib/stores/users';
import { apiDomain, headers } from './config';
import type { User } from '$lib/types';

export const getUsers = async () => {
    const endpoint = `${get(apiDomain)}/api/app-users/${get(id)}`;
    return fetch(endpoint, {
        method: 'GET',
        headers: get(headers)
    })
    .then(response => response.json())
    .then((data) => {
        users.update(() => data.users.map((user: any) => {
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
    .catch((error) => console.error('Error:', error));
}

export const connect = async (userID: number) => {
    const endpoint = `${apiDomain}/api/app-user/connect/${get(id)}/${userID}`;
    return fetch(endpoint, {
        method: 'GET',
        headers: get(headers)
    })
    .then(() => {
        users.update(users => users.map((user: User) => {
            return user.id === userID 
                ? { ...user, isConnected: true } 
                : user;
        }) )
    })
    .catch((error) => console.error('Error:', error));
}

export const disconnect = async (userID: number) => {
    const endpoint = `${apiDomain}/api/app-user/disconnect/${get(id)}/${userID}`;
    return fetch(endpoint, {
        method: 'GET',
        headers: get(headers)
    })
    .then(() => {
        users.update(users => users.map((user: User) => {
            return user.id === userID 
                ? { ...user, isConnected: false } 
                : user;
        }) )
    })
    .catch((error) => console.error('Error:', error));
}