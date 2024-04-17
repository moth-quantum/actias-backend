import { get } from 'svelte/store';
import { id, name, location } from '$lib/stores/profile';
import { apiDomain, apiToken } from './config';
import { debounce } from '$lib/utils/utils';

export const updateProfile = () => {
    const endpoint = `${apiDomain}/api/app-user/${get(id)}/update`;
    const method = 'PATCH';
    const headers = {
        'Authorization' : `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
    }
    
    const unsubscribeName = name.subscribe(debounce((value: string) => {
        fetch(endpoint, {
            method,
            headers,
            body: JSON.stringify({
                "name": value,
            })
        })
        .then(response => response.json())
        .then((data) => {
            console.log('updated name', data)
            localStorage.setItem('q.name', value);
        })
    }, 500))

    const unsubscribeLocation = location.subscribe(debounce((value: string) => {
        fetch(endpoint, {
            method,
            headers,
            body: JSON.stringify({
                "location": value,
            })
        })
        .then(response => response.json())
        .then((data) => {
            console.log('updated location', data)
            localStorage.setItem('q.location', value);
        })
    }, 500))

    return () => {
        unsubscribeName();
        unsubscribeLocation();
    }
}