import type { Tooltip } from '$lib/types';
import { writable, type Writable } from 'svelte/store';

// slider/range tooltips
// const rangeTooltips: Tooltip[] = [
// 	{ element: 'op1fb', message: 'This is an op1fb tooltip message' },
// 	{ element: 'op2ratio', message: 'This is an op2ratio tooltip message' },
// 	{ element: 'op2gain', message: 'This is an op2gain tooltip message' },
// 	{ element: 'op2fb', message: 'This is an op2fb tooltip message' },
// 	{ element: 'op3ratio', message: 'This is an op3ratio tooltip message' },
// 	{ element: 'op3gain', message: 'This is an op3gain tooltip message' },
// 	{ element: 'op3fb', message: 'This is an op3fb tooltip message' },
// 	{ element: 'semitone', message: 'This is a semitone tooltip message' },
// 	{ element: 'octave', message: 'This is an octave tooltip message' },
// 	{ element: 'vol', message: 'This is a vol tooltip message' },
// 	{ element: 'pan', message: 'This is a pan tooltip message' },
// 	{ element: 'reverb', message: 'This is a reverb tooltip message' },
// 	{ element: 'rsize', message: 'This is a rsize tooltip message' },
// 	{ element: 'delay', message: 'This is a delay tooltip message' },
// 	{ element: 'dtime', message: 'This is a dtime tooltip message' },
// 	{ element: 'dcolour', message: 'This is a dcolour tooltip message' },
// 	{ element: 'dfb', message: 'This is a dfb tooltip message' },
// 	{ element: 'chorus', message: 'This is a chorus tooltip message' },
// 	{ element: 'chdepth', message: 'This is a chdepth tooltip message' },
// 	{ element: 'dist', message: 'This is a dist tooltip message' },
// 	{ element: 'crush', message: 'This is an crush tooltip message' },
// 	{ element: 'hicut', message: 'This is an hicut tooltip message' },
// 	{ element: 'locut', message: 'This is an locut tooltip message' },
// ];

export const sliderTooltips: Writable<Tooltip[]> = writable<Tooltip[]>([
	{ element: 'op1fb', message: 'This is an op1fb tooltip message' },
	{ element: 'op2ratio', message: 'This is an op2ratio tooltip message' },
	{ element: 'op2gain', message: 'This is an op2gain tooltip message' },
	{ element: 'op2fb', message: 'This is an op2fb tooltip message' },
	{ element: 'op3ratio', message: 'This is an op3ratio tooltip message' },
	{ element: 'op3gain', message: 'This is an op3gain tooltip message' },
	{ element: 'op3fb', message: 'This is an op3fb tooltip message' },
	{ element: 'semitone', message: 'This is a semitone tooltip message' },
	{ element: 'octave', message: 'This is an octave tooltip message' },
	{ element: 'vol', message: 'This is a vol tooltip message' },
	{ element: 'pan', message: 'This is a pan tooltip message' },
	{ element: 'reverb', message: 'This is a reverb tooltip message' },
	{ element: 'rsize', message: 'This is a rsize tooltip message' },
	{ element: 'delay', message: 'This is a delay tooltip message' },
	{ element: 'dtime', message: 'This is a dtime tooltip message' },
	{ element: 'dcolour', message: 'This is a dcolour tooltip message' },
	{ element: 'dfb', message: 'This is a dfb tooltip message' },
	{ element: 'chorus', message: 'This is a chorus tooltip message' },
	{ element: 'chdepth', message: 'This is a chdepth tooltip message' },
	{ element: 'dist', message: 'This is a dist tooltip message' },
	{ element: 'crush', message: 'This is an crush tooltip message' },
	{ element: 'hicut', message: 'This is an hicut tooltip message' },
	{ element: 'locut', message: 'This is an locut tooltip message' },
]);

// misc button tooltips
export const buttonTooltips: Writable<Tooltip[]> = writable<Tooltip[]>([
	{ element: 'measure', message: 'This is a Measure tooltip message' },
	{ element: 'drone', message: 'This is a Drone tooltip message' }
]);