import { writable } from 'svelte/store';
import { output } from '../../sound';

export const volume = writable(0.5);

volume.subscribe((value) => {
    output.gain.value = value;
});