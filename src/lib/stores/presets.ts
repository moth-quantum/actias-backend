import { writable, get } from 'svelte/store';

export const presetKeys = writable([
    'Preset 1',
    'Preset 2',
    'Preset 3',
    'Preset 4',
    'Preset 5',
    'Preset 6',
    'Preset 7',
    'Preset 8',
    'Preset 9',
    'Preset 10',
    'Preset 11',
    'Preset 12',
    'Preset 13',
    'Preset 14',
    'Preset 15',
    'Preset 16',
])

export const activePreset = writable(0);

activePreset.subscribe((i) => {
    const presets = localStorage.getItem('q1synth-presets');
    if(!presets) return;
    
    const preset = JSON.parse(presets)[get(presetKeys)[i]]
    if(!preset) return;
    
    preset && console.log(preset)
})

const storePreset = (key: string) => {
    const stored = localStorage.getItem('q1synth-presets');
    const presets = stored ? JSON.parse(stored) : {};

    presets[key] = 'banana';
    localStorage.setItem('q1synth-presets', JSON.stringify(presets));
}

// const getPresets = () => {
//     const stored = localStorage.getItem('q1synth-presets');
//     stored  
//         ? presets.set(JSON.parse(stored))
//         : localStorage.setItem('q1synth-presets', JSON.stringify(get(presets)));
// }

// getPresets();