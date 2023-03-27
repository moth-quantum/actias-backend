// TODO: TypeScript
// @ts-nocheck
import { immediate } from 'tone'
import { get } from 'svelte/store'
import { CtSynth, CtSampler, CtGranulator, CtFXChain } from './ct-synths'
import { start, Limiter } from 'tone'
import { samples } from '$lib/stores/samples'

export async function startAudio() {
    await start()    
    console.log('started audio')
    window.removeEventListener('keydown', startAudio)
    window.removeEventListener('click', startAudio)
    window.removeEventListener('touchstart', startAudio)
}

const limiter = new Limiter(-20).toDestination();
const fx = new CtFXChain()
fx.connect(limiter)

const synth = new CtSynth()
synth.connect(fx.input)

const sampler = new CtSampler(get(samples))
sampler.banks = {default: get(samples)}
sampler.currentBank = 'default'
sampler.connect(fx.input)

const granular = new CtGranulator(get(samples))
granular.banks = {default: get(samples)}
granular.currentBank = 'default'
granular.connect(fx.input)

const instruments = { synth, sampler, granular }

export const handleEvent = (params) => {
    const { inst, n} = params
    // TODO: these need to be altered using an additional parameter, rather than the midinote, which is needed for note on / off
    // const n = params.n + (Math.round(octave) * 12) + semitone
    instruments[inst]?.play({...params, n}, immediate() + 0.01)
    fx.set(params, immediate())
}

export const handleNoteOff = (inst, n) => {
    instruments[inst]?.release(n, immediate())
}

export const handleMutation = (params) => {
    const { inst } = params
    instruments[inst]?.mutate({...params}, immediate())
    fx.mutate(params, immediate())
}