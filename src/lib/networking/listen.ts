import { get } from 'svelte/store';
import Echo from "laravel-echo";
import Pusher from "pusher-js";

import { id } from '$lib/stores/profile';

// TODO: do we need the window.Pusher and window.Echo declarations? 
// TODO: get key and host from the Electron app
// TODO: channel logic
export const listen = () => {
    const thisUser = get(id);
	window.Pusher = Pusher;
	window.Echo = new Echo({
			broadcaster: 'reverb',
			cluster: 'eu',
			key: "1|YqZjOA0xTOGPviHOvHKxFqaeC1wAVnkoyGDQ7xXkf2a3cf2f",
			wsHost: "moth-api-staging.lunar.build",
			wsPort: "8080",
			wssPort: "8080",
			forceTLS: false,
			enabledTransports: ['ws', 'wss'],
			disableStats: true,
	});

    console.log(window.Echo)

	window.Echo.channel('userStatus').listen('userActive', (e: any) => {
		console.log(e);
        // TODO: update users store marking user with id e.id as active
	});

    window.Echo.channel('userStatus').listen('userInactive', (e: any) => {
		console.log(e);
        // TODO: update users store marking user with id e.id as inactive
	});

	window.Echo.channel('userPositions.' + thisUser).listen('userPositionChange', (e: any) => {
		console.log(e);
        // TODO: filter qubits by user and update their positions
	});

    return () => {
        window.Echo.leave('userStatus');
        window.Echo.leave('userPositions.' + thisUser);
    }
}