export function mapToRange(
    x: number, inMin: number, inMax: number, outMin: number, outMax: number
) {
    return ((x - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export function mapToStepRange(
    x: number, inMin: number, inMax: number, outMin: number, outMax: number, step: number = 0.5
) {
    return roundToFactor(mapToRange(x, inMin, inMax, outMin, outMax), step)
}

export function roundToFactor(n: number, factor: number = 1) {
    const quotient = n / factor;
    return Math.round(quotient) * factor;
}

export function clamp(n: number, min: number, max: number) {
    return Math.min(Math.max(n, min), max);
}

export function isChrome() {
    return navigator.userAgent.indexOf('Chrome') > -1;
}