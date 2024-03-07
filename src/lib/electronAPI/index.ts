import { activePreset, presets } from '../stores/presets';

export default function initElectronAPI() {
    // presets
    window.electronAPI.onSetPreset((key: string) => activePreset.set(key))
    presets.subscribe(presets => window.electronAPI.setUserPresets(presets))
}
