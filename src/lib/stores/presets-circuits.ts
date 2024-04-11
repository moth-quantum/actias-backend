import { writable, derived, get } from 'svelte/store';
import { circuit } from '$lib/stores/circuit';
import { qubits, initGates } from '$lib/stores/qubits';

export const presets = writable({} as {[key: string]: any | null})

export const activePreset = writable('')

function initPresets() {
    if(typeof localStorage === 'undefined') return
    const stored = JSON.parse(localStorage.getItem('q.presets.circuits') || '{}');
    presets.update(presets => ({
        ...presets, 
        ...stored,
    }))
    activePreset.set('load')
}

initPresets();

presets.subscribe(presets => {
    if(typeof localStorage === 'undefined') return
    localStorage.setItem('q.presets.circuits', JSON.stringify(presets))
})

export const presetKeys = derived(
    presets,
    $presets => Object.keys($presets).sort((a, b) => a.localeCompare(b))
)

activePreset.subscribe(loadPreset)

export function loadPreset(key: string) {
    const preset = get(presets)[key]
    if(!preset) return;
    
    circuit.load(preset)

    const numQubits = get(qubits).reduce((acc, q) => {
        return acc = q.active ? acc + 1 : acc;
    }, 0)

    preset.numQubits < numQubits && 
        Array.from({length: numQubits - preset.numQubits}).forEach((_, i) => initGates(i + preset.numQubits))


    // if the number of qubits in the circuit is more than the number of qubits in the store, add additional qubits to the store
    preset.numQubits > numQubits &&
    qubits.update(qs => {
        return qs.map((q, i) => ({
            ...q,
            active: i < preset.numQubits
        }))
    })

}

export function savePreset(key: string) {
    if(typeof localStorage === 'undefined') return
    const stored = JSON.parse(localStorage.getItem('q.presets.circuits') || "{}");

    // TODO
    stored[key] = circuit.save();
    localStorage.setItem('q.presets.circuits', JSON.stringify(stored));

    presets.update(presets => ({...presets, ...stored}))
    activePreset.set(key)
}

export function deletePreset(key: string) {
    if(typeof localStorage === 'undefined') return
    const stored = JSON.parse(localStorage.getItem('q.presets.circuits') || "{}");
    delete stored[key];
    localStorage.setItem('q.presets.circuits', JSON.stringify(stored));
    presets.set(stored)
    activePreset.set('load')
}

export function editPreset(key: string) {
    if(typeof localStorage === 'undefined') return
    
    const previousName = get(activePreset);
    const stored = JSON.parse(localStorage.getItem('q.presets.circuits') || "{}");
    delete stored[previousName];
    // TODO
    stored[key] = circuit.save();
    localStorage.setItem('q.presets.circuits', JSON.stringify(stored));
    presets.set(stored)
    activePreset.set(key)
}