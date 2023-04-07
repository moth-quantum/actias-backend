// TODO: TypeScript
// @ts-nocheck
import { immediate } from 'tone'
import { get } from 'svelte/store'
import { CtSynth, CtSampler, CtGranulator, CtFXChain } from './ct-synths'
import { start, Limiter, BitCrusher, Gain } from 'tone'
import { samples } from '$lib/stores/samples'
import { drone } from '$lib/stores/parameters'
import { volume, mute } from '$lib/stores/global'
import { mapToStepRange } from '$lib/utils/utils'

export async function startAudio() {
    await start()    
    console.log('started audio')
    window.removeEventListener('keydown', startAudio)
    window.removeEventListener('click', startAudio)
    window.removeEventListener('touchstart', startAudio)
}

export const output = new Gain(1).toDestination();
volume.subscribe((value) => {
    output.gain.value = value;
});

const limiter = new Limiter(-10).connect(output);
const fx = new CtFXChain()
fx.connect(limiter)
const crush = new BitCrusher({bits: 4, wet: 0}).connect(fx.input);

const synth = new CtSynth()
synth.connect(crush)

const sampler = new CtSampler(get(samples))
sampler.banks = {default: get(samples)}
sampler.currentBank = 'default'
sampler.connect(crush)

const granular = new CtGranulator(get(samples))
granular.banks = {default: get(samples)}
granular.currentBank = 'default'
granular.connect(crush)

export const instruments = { synth, sampler, granular }
// const instruments = {}

export const handleEvent = (params) => {
    if(get(mute)) return
    
    const { inst, n} = params
    // TODO: these need to be altered using an additional parameter, rather than the midinote, which is needed for note on / off
    // const n = params.n + (Math.round(octave) * 12) + semitone
    get(drone) && instruments[inst]?.cut(immediate());
    instruments[inst]?.play({...params, n}, immediate() + 0.01)
    fx.set(params, immediate())
    crush.wet.value = params.crush
    crush.set({bits: mapToStepRange(params.crush, 0, 1, 16, 4, 1)})
}

export const handleNoteOff = (inst, n) => {
    !get(drone) && instruments[inst]?.release(n, immediate())
}

export const cut = () => {
    instruments.synth?.cut(immediate());
    instruments.sampler?.cut(immediate());
    instruments.granular?.cut(immediate());
}

export const handleMutation = (params) => {
    const { inst } = params
    instruments[inst]?.mutate({...params}, immediate())
    fx.mutate(params, immediate())
    crush.wet.value = params.crush
    crush.set({bits: mapToStepRange(params.crush, 0, 1, 16, 4, 1)})
}