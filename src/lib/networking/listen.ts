import { get } from 'svelte/store';
import Echo from "laravel-echo";
import Pusher from "pusher-js";

import { id } from '$lib/stores/profile';
import { environment, pusherKey, apiWsDomain } from './config';
import { axes, qubits, isMeasuring } from '$lib/stores/qubits';
import { users } from '$lib/stores/users';
import type { User } from '$lib/types';

export const listen = () => {
    const thisUser = get(id);
	window.Pusher = Pusher;

	const isProduction = get(environment) === 'production';
	window.Echo = new Echo({
		broadcaster: 'reverb',
		cluster: 'eu',
		key: get(pusherKey),
		wsHost: get(apiWsDomain),
		wsPort: 80,
		wssPort: 443,
		forceTLS: isProduction,
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

		const iAmMeasuring = get(isMeasuring)
		const userIsMeasuring = e.coords.x === -1;

		// get the indexes of the qubits that are active and belong to the user
		const usersQubits = get(qubits).reduce((indexes: number[], q, i) => {
			return q.active && q.user === user
				? [...indexes, i]
				: indexes;
		}, []);

		qubits.update(qs => qs.map((q,i) => {
			return usersQubits.includes(i)
				? { ...q, isMeasuring: userIsMeasuring && !iAmMeasuring }
				: q;
		}));
		
		// update the axes of the qubits that belong to the user
		!iAmMeasuring && !userIsMeasuring && axes.filter((_, i) => usersQubits.includes(i)).forEach(store => {
			store.set(Object.values(e.coords))
		})
	});

    return () => {
        window.Echo.leave('userStatus');
        window.Echo.leave('userPositions.' + thisUser);
    }
}