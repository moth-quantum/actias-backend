import { get, writable } from 'svelte/store';

const storedProfile = JSON.parse(localStorage.getItem('q.profile') || '{}');
const storedId = storedProfile.id;
const storedUsername = storedProfile.username;
const storedLocation = storedProfile.location;

export const id = writable<number | undefined>(storedId ? +storedId : undefined);
export const username = writable(storedUsername || 'Quantum Explorer' + Math.random().toString(36).substring(2, 10));
export const location = writable(storedLocation || 'Outer Space');

// Listen for changes to user profile and update local storage
id.subscribe(value => {
    localStorage.setItem('q.profile', JSON.stringify({ ...storedProfile, id: value }));
})

username.subscribe(value => {
    localStorage.setItem('q.profile', JSON.stringify({ ...storedProfile, username: value }));
});

location.subscribe(value => {
    localStorage.setItem('q.profile', JSON.stringify({ ...storedProfile, location: value }));
});

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
        "name": get(username),
        "location": get(location),
      }),
})
.then(response => response.json())
.then(data => id.set(data.id))
.catch((error) => {
    console.error('Error:', error);
});