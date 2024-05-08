import type { Tooltip } from '$lib/types';
import { writable, type Writable, derived, type Readable } from 'svelte/store';
import { menuItems } from './sideMenu';

export const showTooltips: Readable<boolean> = derived(
    menuItems, 
    $menuItems => $menuItems.find(item => item.name === 'tooltips')?.isActive || false
);

export const tooltips: Writable<Tooltip[]> = writable<Tooltip[]>([
	{ element: 'op1fb', message: 'Operator 1 feedback' },
	{ element: 'op2ratio', message: 'Operator 1 harmonicity ratio' },
	{ element: 'op2gain', message: 'Operator 2 gain' },
	{ element: 'op2fb', message: 'Operator 2 feedback' },
	{ element: 'op3ratio', message: 'Operator 3 harmonicity ratio' },
	{ element: 'op3gain', message: 'Operator 3 gain' },
	{ element: 'op3fb', message: 'Operator 3 feedback' },
	{ element: 'semitone', message: 'Transpose by semitone' },
	{ element: 'octave', message: 'Transpose by octave' },
	{ element: 'vol', message: 'Adjust volume of instrument' },
	{ element: 'pan', message: 'Adjust stereo panning' },
	{ element: 'reverb', message: 'Reverb wet/dry amount' },
	{ element: 'rsize', message: 'Reverb room size' },
	{ element: 'delay', message: 'Delay wet/dry amount' },
	{ element: 'dtime', message: 'Delay time' },
	{ element: 'dcolour', message: 'Delay filter colour' },
	{ element: 'dfb', message: 'Delay feedback' },
	{ element: 'chorus', message: 'Chorus wet/dry amount' },
	{ element: 'chdepth', message: 'Chorus LFO depth' },
	{ element: 'dist', message: 'Distortion amount' },
	{ element: 'crush', message: 'Bitcrusher amount' },
	{ element: 'hicut', message: 'High cut filter frequency' },
	{ element: 'locut', message: 'Low cut filter frequency' },
	{ element: 'measure', message: 'Run the circuit and collapse the qubits' },
	{ element: 'drone', message: 'Sustain notes' },
	{ element: 'vol', message: 'Adjust global volume' },
	{ element: 'env-1-a', message: 'Envelope 1 attack' },
	{ element: 'env-1-d', message: 'Envelope 1 decay' },
	{ element: 'env-1-s', message: 'Envelope 1 sustain' },
	{ element: 'env-1-r', message: 'Envelope 1 release' },
	{ element: 'env-2-a', message: 'Envelope 2 attack. Used for FM modulation envelope' },
	{ element: 'env-2-d', message: 'Envelope 2 decay. Used for FM modulation envelope' },
	{ element: 'env-2-s', message: 'Envelope 2 sustain. Used for FM modulation envelope' },
	{ element: 'env-2-r', message: 'Envelope 2 release. Used for FM modulation envelope' },
	{ element: 'learn', message: 'MIDI learn mode. Turn on and select an outlined element. Move a control on an active MIDI device to map the element to the control. Current mappings are listed in the MIDI side menu' },
]);
