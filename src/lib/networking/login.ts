import { get } from 'svelte/store';
import { id, name, location } from '$lib/stores/profile';

export const login = () => {
    const storedId = localStorage.getItem('q.id') || '';
    const storedName = localStorage.getItem('q.name') || '';
    const storedLocation = localStorage.getItem('q.location') || '';

    id.set(storedId ? +storedId : undefined);
    name.set(storedName || 'Quantum Explorer ' + Math.random().toString(36).substring(2, 10));
    location.set(storedLocation || 'Outer Space');

    // TODO: bearer token from Electron APP
    // TODO: API domain from Electron APP
    fetch('https://moth-api-staging.lunar.build/api/app-user/login', {
        method: 'POST',
        headers: {
            'Authorization' : 'Bearer 1|YqZjOA0xTOGPviHOvHKxFqaeC1wAVnkoyGDQ7xXkf2a3cf2f',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "id": get(id),
            "name": get(name),
            "location": get(location),
        }),
    })
    .then(response => response.json())
    .then(data => {
        id.set(data.id)
        localStorage.setItem('q.id', JSON.stringify(data.id));
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

