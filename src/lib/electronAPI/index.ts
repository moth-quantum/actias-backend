import { activePreset, presets } from '$lib/stores/presets';

const showSavePresetDialog = new CustomEvent('showSavePresetDialog');

export default function initElectronAPI() {
    // presets
    window.electronAPI.onSetPreset((key: string) => activePreset.set(key))
    window.electronAPI.onSavePreset(() => {
        console.log('save preset')
        document.dispatchEvent(showSavePresetDialog)
    })
    presets.subscribe(presets => window.electronAPI.syncUserPresets(presets))
}
