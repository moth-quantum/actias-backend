import { get, writable, derived } from 'svelte/store';
import type { User } from '$lib/types';
import { colours } from '$lib/utils/utils';

export const users = writable<User[]>([]);
export const search = writable<string | number>('');
export const page = writable<number>(0);
export const perPage = writable<number>(10);

search.subscribe(() => page.set(0));

export const nextPage = () => page.update(n => n + 1);
export const prevPage = () => page.update(n => n - 1);

export const connectedUsers = derived(users, ($users) => 
    $users.filter(user => user.isConnected)
        .map((user, i) => ({ ...user, colour: colours[(i+1) % colours.length] }))
);
export const activeUsersCount = derived(users, ($users) => $users.filter(user => user.isActive).length);

export const searchResults = derived([users, page, search], ([$users, $page, $search]) => {
    if (!$search) return $users.slice($page * get(perPage), ($page + 1) * get(perPage));
    return $users.filter(user => user.name.toLowerCase().includes($search.toString().toLowerCase())
        || user.id.toString().includes($search.toString()));

});

export const getUserColour = (userID: string | number) => {
    if (userID === 'you') return 'var(--color-theme-1)';
    return get(connectedUsers).find(user => user.id === +userID)?.colour || 'var(--color-grey-darker)';
}

export const getUserName = (userID: string | number) => {
    if (userID === 'you') return 'You';
    return get(users).find(user => user.id === +userID)?.name || 'Unknown';
}