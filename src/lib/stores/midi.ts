import { writable, type Writable} from 'svelte/store';
import { WebMidi } from "webmidi";

export const inputs: Writable<{name: string, active: boolean}[]> = writable([]);

WebMidi
    .enable()
    .then(() => {
        console.log("WebMidi enabled!")
        inputs.update(() => WebMidi.inputs.map(({name}) => ({name, active: true})));
    })