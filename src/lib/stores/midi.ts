import { writable, type Writable, get } from 'svelte/store';
import { WebMidi } from "webmidi";

// export const inputs: Writable<string[]> = writable([]);
export const inputs: Writable<string[]> = writable([]);

WebMidi
    .enable()
    .then(() => {
        console.log("WebMidi enabled!")
        inputs.update(() => WebMidi.inputs.map(input => input.name));
    })
    .catch(err => alert(err));