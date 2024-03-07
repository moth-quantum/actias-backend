import { activePreset, presets } from '$lib/stores/presets';
import { updateSamples } from '$lib/stores/samples';
import { getAppState } from '$lib/stores/parameters';

const showSavePresetDialog = new CustomEvent('showSavePresetDialog');

export default function initElectronAPI() {
    // presets
    window.electronAPI.onSetPreset((key: string) => activePreset.set(key))
    window.electronAPI.onSavePreset(() => document.dispatchEvent(showSavePresetDialog))
    presets.subscribe(presets => window.electronAPI.syncUserPresets(presets))
    window.electronAPI.onExportPreset(() => {
        window.electronAPI.exportPresetResponse(getAppState())
    })
    window.electronAPI.onImportPreset((data: {name: string, data: any}) => {
        // TODO: import preset
        console.log(data)
    })
    window.electronAPI.onUpdateSamples(updateSamples)
}
