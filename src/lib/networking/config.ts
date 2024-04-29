import { writable, derived } from 'svelte/store';

export const apiDomain = writable('');
export const apiToken = writable('');
export const pusherKey = writable('');
export const headers = derived([apiToken], ([$apiToken]) => {
    return {
        'Authorization' : `Bearer ${$apiToken}`,
        'Content-Type': 'application/json',
    }
})

// TODO: API domain from Electron APP
// export const apiDomain = 'http://moth-q1-api.test';
// // TODO: bearer token from Electron APP
// export const apiToken = '1|lu2SHkmUrKAQIl8OwKMPo7ReZkpu5lsh47rYWmF74a223638';
// export const headers = {
//     'Authorization' : `Bearer ${apiToken}`,
//     'Content-Type': 'application/json',
// };
// TODO: get key and host from the Electron app
// export const pusherKey = 'a2eopc5dh3ifhlbhddcf';