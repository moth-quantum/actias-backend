import { get } from 'svelte/store';
import { qubits } from '$lib/stores/qubits';
import { throttle } from '$lib/utils/utils';
import { id } from '$lib/stores/profile';
import { apiDomain, headers } from './config';

const sendPosition = (axes: number[]) => {
    // console.log(axes[2])
    const endpoint = `${apiDomain}/api/app-user/${get(id)}/position`;

    fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            "coords": {
                x: axes[0],
                y: axes[1],
                z: axes[2],
            }
        })
    })
    // .then(response => response.json())
    // .then(data => console.log('Success:', data))
    .catch((error) => console.error('Error:', error));
}


const handleBroadcast = 
// TODO: remove this and only have it on the mousedrag?
throttle(
    (e: any) => {
    const qs = get(qubits);
    const changedQubit = e.detail;
    const yourQubit = qs.findIndex(q => q.active && q.user === 'you');
    if (yourQubit === -1 || changedQubit !== yourQubit) return;

    sendPosition(qs[yourQubit].axes.map(a => a.value));
}
, 100)

export const broadcast = () => {
    document.addEventListener('updateQubit', handleBroadcast);

    return () => document.removeEventListener('updateQubit', handleBroadcast);
}