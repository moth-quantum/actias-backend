import { get } from 'svelte/store';
import { id, name, location, isLoggedIn } from '$lib/stores/profile';
import { apiDomain, headers } from './config';
import { addToast } from '$lib/stores/toasts';

export const login = async () => {
    // Check if we have a stored user
    const storedId = localStorage.getItem('q.id') || '';
    const storedName = localStorage.getItem('q.name') || '';
    const storedLocation = localStorage.getItem('q.location') || '';
    
    id.set(+storedId);
    name.set(storedName || 'Quantum Explorer ' + Math.random().toString(36).substring(2, 10));
    location.set(storedLocation || 'Outer Space');

    // If we have a stored user, we can just login, otherwise we need to register
    const endpoint = get(id)
        ? `/api/app-user/${get(id)}/login`
        : '/api/app-user/register';

    const method = get(id) ? 'GET' : 'POST';

    let request: {headers: {}, method: string, body?: string} = {
        headers: get(headers),
        method
    }

    method === 'POST' && (request = {
        ...request,
        body: JSON.stringify({
        "name": get(name),
        "location": get(location),
    })})

    // Conditionally login / register
    return fetch(`${get(apiDomain)}${endpoint}`, request)
        .then(response => response.json())
        .then((response) => {
            response.status === 404 && addToast('404: login / register', 'warning');
            response.status === 500 && addToast('500: Server error when logging in / registering', 'error');
            return response;
        })
        .then(({user}) => {
            // ensure that we store the user id for future requests
            id.set(user.id)
            localStorage.setItem('q.id', user.id);
            isLoggedIn.set(true);
        })
        .catch((error) => console.error('Error:', error));
}

export const logout = () => {
    const endpoint = `/api/app-user/${get(id)}/logout`

    return fetch(`${get(apiDomain)}${endpoint}`, {
        headers: get(headers),
        method: 'GET'
    })
}