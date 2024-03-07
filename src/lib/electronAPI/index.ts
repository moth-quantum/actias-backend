import { activePreset, presets } from '../stores/presets';

export default function initElectronAPI() {
    // presets
    window.electronAPI.onSetPreset((key: string) => activePreset.set(key))
    window.electronAPI.onSavePreset(() => console.log('open save dialog')) 
    presets.subscribe(presets => window.electronAPI.syncUserPresets(presets))
}
