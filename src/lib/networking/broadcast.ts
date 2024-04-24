import { get } from 'svelte/store';
import { axes } from '$lib/stores/qubits';
import { throttle } from '$lib/utils/utils';
import { id, isLoggedIn } from '$lib/stores/profile';
import { apiDomain, headers } from './config';

const sendPosition = (axes: number[]) => {
    if(!get(isLoggedIn)) return;

    fetch(`${apiDomain}/api/app-user/${get(id)}/position`, {
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
    .catch((error) => console.error('Error:', error));
}

export const broadcast = () => {
    const unsubscribeAxes = axes[0].subscribe(throttle(sendPosition, 100))

    return () => {
        unsubscribeAxes();
    }
}