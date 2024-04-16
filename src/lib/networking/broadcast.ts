import { get } from 'svelte/store';
import { qubits } from '$lib/stores/qubits';
import { debounce } from '$lib/utils/utils';
import { id } from '$lib/stores/profile';

const sendPosition = (axes: number[]) => {
    // TODO: bearer token from Electron APP
    // TODO: API domain from Electron APP
    // TODO: rename endpoint
    fetch('https://moth-api-staging.lunar.build/api/send', {
        method: 'POST',
        headers: {
            'Authorization' : 'Bearer 1|YqZjOA0xTOGPviHOvHKxFqaeC1wAVnkoyGDQ7xXkf2a3cf2f',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "id": get(id),
            "coords": {
                x: axes[0],
                y: axes[1],
                z: axes[2],
            }
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


const handleBroadcast = debounce((e: any) => {
    const qs = get(qubits);
    const changedQubit = e.detail;
    const yourQubit = qs.findIndex(q => q.active && q.user === 'you');
    if (yourQubit === -1 || changedQubit !== yourQubit) return;

    sendPosition(qs[yourQubit].axes.map(a => a.value));
}, 100)

export const broadcast = () => {
    document.addEventListener('updateQubit', handleBroadcast);

    return () => document.removeEventListener('updateQubit', handleBroadcast);
}