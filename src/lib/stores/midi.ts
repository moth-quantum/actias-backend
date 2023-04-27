import { writable, readable, type Writable} from 'svelte/store';
import { WebMidi } from "webmidi";

export const inputs: Writable<{name: string, active: boolean}[]> = writable([]);

WebMidi
    .enable()
    .then(() => {
        console.log("WebMidi enabled!")
        inputs.update(() => WebMidi.inputs.map(({name}) => ({name, active: true})));
    })

export const ccMap = readable({
    x: 1,
    y: 2,
    z: 3,
})