export type InstrumentName = 'synth' | 'sampler' | 'granular' | 'wavetable';

type Dictionary = {[key: string]: any};

export interface Envelope extends Dictionary {
    key: string;
    name: string;
    a: number;
    d: number;
    s: number;
    r: number;
}

export interface Parameter {
    type: string
    key: string;
    name: string;
    rangeA: number;
    rangeB: number;
    min: number;
    max: number;
    step: number;
    units: string;
    outmin?: number;
    outmax?: number;
}

export interface Socket {
    id: string;
    type: 'origin' | 'remote';
    colour: string;
    offset: number;
    active: boolean;
    x: number;
    y: number;
    width: number;
}

export type Connection = [string, string];

export interface Preset {
    instrument: InstrumentName;
    connections: Connection[];
    params: Parameter[];
    envelopes: Envelope[];
};

// Electron types
declare global {
    interface Window {
        isApp: boolean;
        electronAPI: {
            syncUserPresets(data: {[key: string]: Preset | null}): void;
            onSetPreset(callback: (key: string) => void): void;
            onSavePreset(callback: () => void): void;
            onExportPreset(callback: () => void): void;
            exportPresetResponse(data: any): void;
            onImportPreset(callback: (data: any) => void): void;
        };
    }
}