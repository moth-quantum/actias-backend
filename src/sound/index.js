// TODO: TypeScript
// @ts-nocheck
import { immediate } from 'tone'

import { CtSynth, CtFXChain } from './ct-synths'
import { start, Limiter } from 'tone'

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

const synths = { synth }

export const handleEvent = (params) => {
    const { inst, n} = params
    // TODO: these need to be altered using an additional parameter, rather than the midinote, which is needed for note on / off
    // const n = params.n + (Math.round(octave) * 12) + semitone
    synths[inst]?.play({...params, n}, immediate())
    fx.set(params, immediate())
}

export const handleNoteOff = ({inst, n}) => {
    // synths[inst]?.releaseNote(n, immediate())
}

export const handleMutation = (params) => {
    const { inst } = params
    synths[inst]?.mutate({...params}, immediate())
    fx.mutate(params, immediate())
}