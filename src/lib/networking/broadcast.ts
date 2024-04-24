import { get } from 'svelte/store';
import { axes } from '$lib/stores/qubits';
import { throttle } from '$lib/utils/utils';
import { id } from '$lib/stores/profile';
import { apiDomain, headers } from './config';

const sendPosition = 
throttle(
    (axes: number[]) => {
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
, 50)

export const broadcast = () => {
    const unsubscribeAxes = axes[0].subscribe((axes) => {
        sendPosition(axes);
    })

    return () => {
        unsubscribeAxes();
    }
}