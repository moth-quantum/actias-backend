import { get } from 'svelte/store';
import { axes, isMeasuring } from '$lib/stores/qubits';
import { throttle } from '$lib/utils/utils';
import { id, isLoggedIn } from '$lib/stores/profile';
import { apiDomain, headers } from './config';
import { addToast } from '$lib/stores/toasts';

const sendPosition = (axes: number[]) => {
    if(!get(isLoggedIn)) return;

    const [ x, y, z ] = axes;
    const coords = {x, y, z};

    fetch(`${get(apiDomain)}/api/app-user/${get(id)}/position`, {
        method: 'POST',
        headers: get(headers),
        body: JSON.stringify({ coords })
    })
    .then((response) => {
        response.status === 404 && addToast('404: broadcasting position', 'warning');
        response.status === 500 && addToast('500: Server error when broadcasting position', 'error');
    })
    .catch((error) => console.error('Error:', error));
}

const throttledSendPosition = throttle(sendPosition, 100);

export const broadcast = () => {
    const unsubscribeAxes = axes[0].subscribe((axes: number[]) => {
        !get(isMeasuring) && throttledSendPosition(axes)
    })

    const unsubscribeIsMeasuring = isMeasuring.subscribe((isMeasuring: boolean) => {
        isMeasuring
            ? sendPosition([-1, -1, -1])
            : sendPosition(get(axes[0]))
    })

    return () => {
        unsubscribeAxes();
        unsubscribeIsMeasuring();
    }
}