import { get } from 'svelte/store';
import { id, name, location } from '$lib/stores/profile';
import { apiDomain, headers } from './config';
import { debounce } from '$lib/utils/utils';

export const updateProfile = () => {
    const endpoint = `${get(apiDomain)}/api/app-user/${get(id)}/update`;
    const method = 'PATCH';
    
    // listen for changes to the name and location stores
    const unsubscribeName = name.subscribe(debounce((value: string) => {
        // update local storage value so that it persists
        localStorage.setItem('q.name', value);
        
        // update the api
        const body = JSON.stringify({"name": value});
        fetch(endpoint, { method, headers: get(headers), body })
            .catch((error) => console.error('Error:', error));

    }, 500))

    const unsubscribeLocation = location.subscribe(debounce((value: string) => {
        // update local storage value so that it persists
        localStorage.setItem('q.location', value);
        
        // update the api
        const body = JSON.stringify({"location": value});
        fetch(endpoint, { method, headers: get(headers), body })
            .catch((error) => console.error('Error:', error));

    }, 500))

    // return a function to unsubscribe from the stores
    return () => {
        unsubscribeName();
        unsubscribeLocation();
    }
}