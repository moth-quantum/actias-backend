import type Echo from "laravel-echo";
import type Pusher from "pusher-js";
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
    isLocked?: boolean;
    tooltipMessage?: string;
}

export interface Tooltip {
    element: string;
    message: string;
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
    circuit: any;
    numQubits: number;
};

// Electron types
declare global {
    interface Window {
        isApp: boolean;
        apiDomain: string;
        apiWsDomain: string;
        apiToken: string;
        apiPusherKey: string;
        electronAPI: {
            onSetAPICredentials(callback: (data: {apiDomain: string, apiToken: string, apiPusherKey: string}) => void): void;
            onSetPreset(callback: (key: string) => void): void;
            onSavePreset(callback: () => void): void;
            onImportPreset(callback: (data: any) => void): void;
            onUpdateSamples(callback: (samples: string[]) => void): void;
            onExportPreset(callback: () => void): void;
            exportPresetResponse(data: any): void;
            syncUserPresets(data: {[key: string]: Preset | null}): void;
            onQuit(callback: () => void): void;
        };
        Pusher: typeof Pusher;
        Echo: Echo;
    }
}

export interface Axis {
    key: string;
    name: string;
    value: number;
    min: number;
    max: number;
    step: number;
    colour: string;
}

export interface User {
    id: number;
    name: string;
    location: string;
    x: number;
    y: number;
    z: number;
    isActive: boolean;
    isConnected: boolean;
}

export interface Action {
    label: string;
    action: (value: number) => void;
}