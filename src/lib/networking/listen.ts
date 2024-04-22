import { get } from 'svelte/store';
import Echo from "laravel-echo";
import Pusher from "pusher-js";

import { id } from '$lib/stores/profile';
import { pusherKey } from './config';
import { qubits } from '$lib/stores/qubits';

// TODO: do we need the window.Pusher and window.Echo declarations? 
// TODO: get key and host from the Electron app
// TODO: channel logic
export const listen = () => {
    const thisUser = get(id);
	window.Pusher = Pusher;
	window.Echo = new Echo({
		broadcaster: 'reverb',
		cluster: 'eu',
		key: pusherKey,
		wsHost: "127.0.0.1",
		wsPort: "8080",
		wssPort: "8080",
		forceTLS: false,
		enabledTransports: ['ws', 'wss'],
		disableStats: true,
	});

	window.Echo.channel('userStatus').listen('UserStatusChange', (e: any) => {
        // TODO
		console.log(e);
	});

	window.Echo.channel('userPositions.' + thisUser).listen('UserPositionChange', (e: any) => {
        // TODO
		const user = e.sender?.id;
		if(!user) return;

		const axes: number[] = Object.values(e.coords);
		
		qubits.update(qs => {
			return qs.map(q => {
				if (q.user === user) {
					axes.forEach((a, i) => {
						q.axes[i].value = a;
					});
				}
				return q;
			})
		});
	});

    return () => {
        window.Echo.leave('userStatus');
        window.Echo.leave('userPositions.' + thisUser);
    }
}