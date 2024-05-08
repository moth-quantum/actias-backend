import { get } from 'svelte/store';
import { id } from '$lib/stores/profile';
import { users } from '$lib/stores/users';
import { apiDomain, headers } from './config';
import type { User } from '$lib/types';
import { addToast } from '$lib/stores/toasts';

export const getUsers = async () => {
    const endpoint = `${get(apiDomain)}/api/app-users/${get(id)}`;
    return fetch(endpoint, {
        method: 'GET',
        headers: get(headers)
    })
    .then(response => response.json())
    .then((response) => {
        response.status === 404 && addToast('404: get users', 'warning');
        response.status === 500 && addToast('500: Server error when getting users', 'error');
        return response
    })
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
    const endpoint = `${get(apiDomain)}/api/app-user/connect/${get(id)}/${userID}`;
    return fetch(endpoint, {
        method: 'GET',
        headers: get(headers)
    })
    .then((response) => {
        response.status === 404 && addToast('404: connect users', 'warning');
        response.status === 500 && addToast('500: Server error when connecting users', 'error');
        return response
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
    .then((response) => {
        response.status === 404 && addToast('404: disconnect users', 'warning');
        response.status === 500 && addToast('500: Server error when disconnecting users', 'error');
        return response
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