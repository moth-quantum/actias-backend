import { writable } from 'svelte/store';

const tooltipContent: Array<{ element: string; message: string; }> = [
	{ element: 'op1fb', message: 'This is a tooltip message' },
	{ element: 'op2r', message: 'This is a tooltip message' }
];

export const tooltips = writable(tooltipContent);