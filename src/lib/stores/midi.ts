import { writable, type Writable} from 'svelte/store';
import { WebMidi } from "webmidi";

export const inputs: Writable<{name: string, active: boolean}[]> = writable([]);

WebMidi
    .enable()
    .then(() => {
        console.log("WebMidi enabled!")
        inputs.update(() => WebMidi.inputs.map(({name}) => ({name, active: true})));
    })

function addCCListeners(name: string) {
    const input = WebMidi.getInputByName(name);
    if(input?.hasListener("controlchange", handleControlChange)) return
    input?.addListener("controlchange", handleControlChange);
}

function removeCCListeners(name: string) {
    const input = WebMidi.getInputByName(name);
    input?.removeListener("controlchange", handleControlChange);
}
    
function handleControlChange(e) {
    const { value, controller: {number} } = e;
    console.log(value, number)
}
    
inputs.subscribe(inputs => {
    inputs.forEach(({name, active}) => active 
        ? addCCListeners(name)
        : removeCCListeners(name)
    )
})