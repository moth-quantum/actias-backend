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

export function clamp(n: number, min: number = 0, max: number = 1) {
    return Math.min(Math.max(n, min), max);
}

export function isChrome() {
    return navigator.userAgent.indexOf('Chrome') > -1;
}

export function debounce(func: Function, delay: number) {
    let timeoutId: NodeJS.Timeout;

    return  (...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            // @ts-ignore
            func.apply(this, args);
        }, delay);
    };
}

export function throttle(func: Function, delay: number) {
    let lastCall = 0;
    return (...args: any[]) => {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return func(...args);
    };
}

export function add(a: number, b: number) {
    return a + b;
}

export const colours = [
    "#ff8374",
    "#ff1a99",
    "#1abdb3",
    "#ff9c8d",
    "#ff33b2",
    "#33d6cc",
    "#ffb6a7",
    "#ff4dcc",
    "#4df0e6",
    "#ffcfc0",
    "#ff66e5",
    "#66ffff"
]

export function min(a: number, b: number) {
    return a < b ? a : b;
}

interface Element {
    x: number;
    y: number;
    width: number;
    height: number;
}
export function areTouching(el1: Element, el2: Element): boolean {
    const x1 = el1.x;
    const y1 = el1.y;
    const width1 = el1.width;
    const height1 = el1.height;

    const x2 = el2.x;
    const y2 = el2.y;
    const width2 = el2.width;
    const height2 = el2.height;

    return (
        x1 < x2 + width2 &&
        x1 + width1 > x2 &&
        y1 < y2 + height2 &&
        y1 + height1 > y2
    );
}
export const arraysAreEqual = (array1: any[], array2: any[]) => 
    array1.length === array2.length && array1.every((value, index) => value === array2[index]);