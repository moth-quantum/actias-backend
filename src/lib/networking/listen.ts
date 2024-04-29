import { get } from 'svelte/store';
import Echo from "laravel-echo";
import Pusher from "pusher-js";

import { id } from '$lib/stores/profile';
import { pusherKey } from './config';
import { axes, qubits } from '$lib/stores/qubits';
import { users } from '$lib/stores/users';
import type { User } from '$lib/types';

// TODO: do we need the window.Pusher and window.Echo declarations? 
// TODO: get key and host from the Electron app
export const listen = () => {
    const thisUser = get(id);
	window.Pusher = Pusher;
	window.Echo = new Echo({
		broadcaster: 'reverb',
		cluster: 'eu',
		key: get(pusherKey),
		wsHost: "127.0.0.1",
		wsPort: "8080",
		wssPort: "8080",
		forceTLS: false,
		enabledTransports: ['ws', 'wss'],
		disableStats: true,
	});

	window.Echo.channel('userStatus').listen('UserStatusChange', (e: any) => {
		const {id, isActive} = e;
		users.update(users => users.map((user: User) => {
			return user.id === +id
				? { ...user, isActive: !!isActive }
				: user;
		}));
	});

	window.Echo.channel('userPositions.' + thisUser).listen('UserPositionChange', (e: any) => {
		const user = e.sender?.id;
		if(!user) return;

		// get the indexes of the qubits that are active and belong to the user
		const usersQubits = get(qubits).reduce((indexes: number[], q, i) => {
			return q.active && q.user === user
				? [...indexes, i]
				: indexes;
		}, []);
		

		// update the axes of the qubits that belong to the user
		axes.filter((_, i) => usersQubits.includes(i)).forEach(store => {
			store.set(Object.values(e.coords))
		})
	});

    return () => {
        window.Echo.leave('userStatus');
        window.Echo.leave('userPositions.' + thisUser);
    }
}