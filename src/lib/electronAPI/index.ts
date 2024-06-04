import { activePreset, presets, importPreset, currentState } from '$lib/stores/presets-project';
import { updateSamples } from '$lib/stores/samples';
import { environment, apiDomain, apiWsDomain, apiToken, pusherKey } from '$lib/networking/config';
import { logout } from '$lib/networking/logout';

export default function initElectronAPI() {

    if(typeof document === 'undefined' || (typeof window === 'undefined')) return
    
    environment.set(window.environment)
    // Set API credentials
    apiDomain.set(window.apiDomain)
    apiWsDomain.set(window.apiWsDomain)
    apiToken.set(window.apiToken)
    pusherKey.set(window.apiPusherKey)
    
    // presets
    window.electronAPI.onSetPreset((key: string) => activePreset.set(key))
    window.electronAPI.onSavePreset(() => {
        const showSavePresetDialog = new CustomEvent('showSavePresetDialog');
        document.dispatchEvent(showSavePresetDialog)
    })
    presets.subscribe(presets => window.electronAPI.syncUserPresets(presets))
    window.electronAPI.onExportPreset(() => {
        window.electronAPI.exportPresetResponse(currentState())
    })
    window.electronAPI.onImportPreset((data: {name: string, data: any}) => {
        importPreset(data.name, data.data)
    })
    window.electronAPI.onUpdateSamples(updateSamples)

    window.electronAPI.onQuit(logout)
}
