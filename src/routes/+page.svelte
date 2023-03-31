<script>
    import { onMount } from 'svelte';
    import { instrument, instruments } from '$lib/stores/parameters';
    import { startAudio } from '../sound';
    import { axes } from '$lib/stores/qubit';
    import Patchbay from '$lib/components/Patching/Patchbay.svelte';

    import Parameters from '$lib/components/Parameters/Parameters.svelte';
    import Controls from '$lib/components/Controls/Controls.svelte';
    import Button from '$lib/components/Button/Button.svelte';
    import Measure from '$lib/components/Measure/Measure.svelte';
    import Slider from '$lib/components/Sliders/Slider.svelte';
    import Qubit from '$lib/components/Qubit/Qubit.svelte';

    let axesIds = $axes.map(({key}) => key);
    let axesNames = $axes.map(({name}) => name);
    let qubitH = 0;

    onMount(() => {
        window.addEventListener('keydown', startAudio)
        window.addEventListener('click', startAudio)
        window.addEventListener('touchstart', startAudio)
    });

</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="TODO: please write a description" />
</svelte:head>

<svelte:window on:click={startAudio} />

<section class="buttons container mx-auto">
    {#each instruments as inst}
        <Button 
            onClick={() => instrument.set(inst)} 
            active={$instrument === inst} 
            disabled={$instrument !== inst}
            colour="yellow" 
            text={inst} 
        />
    {/each}
</section>

<section class="synth container mx-auto">
    
    <div class="parameters">
        <Parameters />
    </div>

    <div class="qubit">
        <div class="qubit__inner">
            <div class="qubit__patchbay">
                <Patchbay 
                    title="axes"
                    ids={axesIds.reverse()} 
                    labels={axesNames.reverse()} 
                />
            </div>
            
            <div class="qubit__sphere" bind:clientHeight={qubitH}>
                <!-- <Qubit size={qubitH * 0.8} phi={$axes[1].value} theta={$axes[2].value} phase={$axes[0].value} /> -->
            </div>

            <div class="qubit__sliders" style={`width: ${qubitH}px;`}>
                <div>
                    {#each $axes as {value, min, max, step, name, colour} (name)}
                        <Slider 
                            {min} {max} {step} {name} {colour}
                            bind:value={value}
                        />
                    {/each}
                </div>
            </div>
        </div>
    </div>

    <div class="metrics">
        Metrics go here
    </div>

    <div class="controls">
        <Controls />
    </div>

    <div class="measure">
        <Measure />
    </div>

</section>

<style lang="scss">
    .buttons {
        padding: 0.75rem 2rem;
        background-color: var(--color-grey-mid);
        box-shadow: 0 0.5rem 0.5rem 0.25rem var(--color-box-shadow);
	}

    .synth {
        padding: 1.5rem 2rem;
        display: grid;
        grid-gap: 1rem;
        grid-template-columns: 1fr;
        grid-template-rows: 3fr 1fr 1fr;

        @media (min-width: 1200px) {
            grid-template-columns: 3fr 6fr 3fr;
            grid-template-rows: 1fr 1fr 0.5fr;
        }
    }

    .parameters {
        display: none;
        flex-direction: column;
        grid-column-start: 1;
        grid-column-end: 1;
        grid-row-start: 1;
        grid-row-end: 4;

        @media (min-width: 1200px) {
            display: flex;
        }
    }

    .qubit {
        grid-column-start: 1;
        grid-column-end: 1;
        grid-row-start: 1;
        grid-row-end: 1;

        @media (min-width: 1200px) {
            grid-column-start: 2;
            grid-column-end: 4;
            grid-row-start: 1;
            grid-row-end: 3;
            display: grid;
            grid-template-columns: 6fr 3fr;
        }
        
        background-color: var(--color-grey-dark);
        border-radius: 10px;

        &__inner {
            height: 100%;
            display: flex;
            justify-content: space-between;
            position: relative;
            padding: 1rem 2rem;
        }

        &__sphere {
            position: absolute;
            top: 0%;
            left: 0%;
            bottom: 0;
            right: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        &__patchbay {
            z-index: 10;
            display: none;
            @media (min-width: 1200px) {
                display: block;
            }
        }
        &__sliders {
            display: flex;
            grid-column-start: 5;
            grid-column-end: 7;
            grid-row-start: 1;
            grid-row-end: 3;
            z-index: 10;
            padding: 0 1rem;
            margin: 0 -0.8rem 0 0;

            & > div {
                width: 100%;
                @media (min-width: 1200px) {
                    transform: rotate(90deg);
                }
            }
        }
    }

    .metrics {
        display: none;
        grid-column-start: 3;
        grid-column-end: 3;
        grid-row-start: 1;
        grid-row-end: 3;
        padding: 1rem;
        
        @media (min-width: 1200px) {
            display: block;
        }
        
    }

    .controls {
        grid-column-start: 1;
        grid-column-end: 1;
        grid-row-start: 2;
        grid-row-end: 2;

        @media (min-width: 1200px) {
            grid-column-start: 2;
            grid-column-end: 2;
            grid-row-start: 3;
            grid-row-end: 4;
        }
        background-color: var(--color-grey-dark);
        border-radius: 10px;
    }

    .measure {
        grid-column-start: 1;
        grid-column-end: 1;
        grid-row-start: 3;
        grid-row-end: 3;
        @media (min-width: 1200px) {
            grid-column-start: 3;
            grid-column-end: 3;
            grid-row-start: 3;
            grid-row-end: 4;   
        }
    }
</style>
