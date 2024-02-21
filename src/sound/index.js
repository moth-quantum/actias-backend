// TODO: TypeScript
// @ts-nocheck
import { immediate } from 'tone'
import { get } from 'svelte/store'
import { CtSuperFM, CtSampler, CtGranulator, CtWavetable, CtFXChain } from './ct-synths'
import { start, Limiter, BitCrusher, Gain } from 'tone'
import { samples } from '$lib/stores/samples'
import { drone, synthValues } from '$lib/stores/parameters'
import { envelopeValues } from '$lib/stores/envelopes'
import { volume, mute } from '$lib/stores/global'
import { mapToStepRange } from '$lib/utils/utils'

export async function startAudio() {
    await start()    
    console.log('started audio')
    window.removeEventListener('keydown', startAudio)
    window.removeEventListener('click', startAudio)
    window.removeEventListener('touchstart', startAudio)
}

// destination
export const output = new Gain(1).toDestination();
volume.subscribe((value) => {
    output.gain.value = value;
});

// chain of fx pre-desination
const limiter = new Limiter(-10).connect(output);
const fx = new CtFXChain()
fx.connect(limiter)
const crush = new BitCrusher({bits: 4, wet: 0}).connect(fx.input);

// initialize instruments
const synth = new CtSuperFM()
synth.connect(crush)

const sampler = new CtSampler()
sampler.banks = {default: get(samples)}
sampler.bank('default')
sampler.connect(crush)

const granular = new CtGranulator()
granular.banks = {default: get(samples)}
granular.bank('default')
granular.connect(crush)

const wavetable = new CtWavetable()
wavetable.banks = {default: get(samples)}
wavetable.bank('default')
wavetable.connect(crush)

// load samples where applicable
samples.subscribe(s => [sampler, granular, wavetable].forEach(inst => inst.banks = {default: s}))

export const instruments = { synth, sampler, granular, wavetable }

export const handleEvent = (params) => {
    if(get(mute)) return
    
    const { inst, n, semitone, octave} = params
    const detune = semitone + (octave * 12)

    get(drone) && inst === 'synth' && instruments[inst]?.cut(immediate());
    instruments[inst]?.play({...params, n, detune}, immediate() + 0.01)
    fx.set(params, immediate())
    crush.wet.value = params.crush
    crush.set({bits: mapToStepRange(params.crush, 0, 1, 16, 4, 1)})
}

export const handleNoteOff = (inst, n) => {
    !get(drone) && instruments[inst]?.release(n, immediate())
}

export const cut = () => {
    const r = get(envelopeValues).r
    instruments.synth?.cut(immediate(), r);
    instruments.sampler?.cut(immediate(), r);
    instruments.granular?.cut(immediate(), r);
}

export const handleMutation = (params) => {
    const { inst, semitone, octave} = params
    const detune = semitone + (octave * 12)

    instruments[inst]?.mutate({...params, detune}, immediate())
    fx.mutate(params, immediate())
    crush.wet.value = params.crush
    crush.set({bits: mapToStepRange(params.crush, 0, 1, 16, 4, 1)})
}

synthValues.subscribe(values => handleMutation(values))

drone.subscribe(d => {
    !d && cut();
    return d;
})