// TODO: TypeScript
// @ts-nocheck
import { immediate } from 'tone'

import { CtSynth } from './ct-synths'
import { start } from 'tone'

export async function startAudio() {
    await start()    
    console.log('started audio')
    window.removeEventListener('keydown', startAudio)
    window.removeEventListener('click', startAudio)
    window.removeEventListener('touchstart', startAudio)
}

const synth = new CtSynth()
synth.output.toDestination()

const synths = {
    synth: new CtSynth(),
}

export const handleEvent = (params) => {
    const { inst } = params
    synths[inst]?.play(params, immediate())
}

export const handleMutation = (params) => {
    console.log(params)
    // const { inst } = params
    // synths[inst]?.mutate(params, immediate())
}