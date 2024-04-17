import { get } from 'svelte/store';
import { id, name, location } from '$lib/stores/profile';
import { apiDomain, apiToken } from './config';

export const login = () => {
    // Check if we have a stored user
    const storedId = localStorage.getItem('q.id') || '';
    const storedName = localStorage.getItem('q.name') || '';
    const storedLocation = localStorage.getItem('q.location') || '';

    id.set(storedId ? +storedId : undefined);
    name.set(storedName || 'Quantum Explorer ' + Math.random().toString(36).substring(2, 10));
    location.set(storedLocation || 'Outer Space');

    console.log(get(id))

    // If we have a stored user, we can just login, otherwise we need to register
    const endpoint = get(id) !== undefined
        ? `/api/app-user/${get(id)}/login`
        : '/api/app-user/register';

    const method = get(id) ? 'GET' : 'POST';

    const headers = {
        'Authorization' : `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
    }

    let request: {headers: {}, method: string, body?: string} = {
        headers,
        method
    }

    method === 'POST' && (request = {
        ...request,
        body: JSON.stringify({
        "name": get(name),
        "location": get(location),
    })})
    
    // Conditionally login / register
    fetch(`${apiDomain}${endpoint}`, request)
        .then(response => response.json())
        .then(({user}) => {
            // ensure that we store the user id for future requests
            id.set(user.id)
            localStorage.setItem('q.id', user.id);
        })
        .catch((error) => console.error('Error:', error));
}

