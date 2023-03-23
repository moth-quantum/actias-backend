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

    let slidersW = 0;
    let slidersH = 0;

    let axesIds = $axes.map(({key}) => key);
    let axesNames = $axes.map(({name}) => name);

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
        <div class="axes">
            <Patchbay 
                title="axes"
                ids={axesIds.reverse()} 
                labels={axesNames.reverse()} 
            />
        </div>
        <div class="axes-sliders" bind:clientHeight={slidersH} bind:clientWidth={slidersW}>
            <div style={`height: ${slidersW}px; width: ${slidersH}px;`}>
                {#each $axes as {value, min, max, step, name, colour} (name)}
                    <Slider 
                        {min} {max} {step} {name} {colour}
                        bind:value={value}
                    />
                {/each}
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

<style>
	.buttons {
        padding: 0.75rem 2rem;
        background-color: var(--color-grey-mid);
        box-shadow: 0 0.5rem 0.5rem 0.25rem var(--color-box-shadow);
	}

    .synth {
        padding: 1.5rem 2rem;
        display: grid;
        grid-template-columns: 3fr 6fr 3fr;
        grid-template-rows: 1fr 1fr 1fr;
        grid-gap: 1rem;
        /* min-height: 100vh; */
    }

    .parameters {
        display: flex;
        flex-direction: column;
        grid-column-start: 1;
        grid-column-end: 1;
        grid-row-start: 1;
        grid-row-end: 4;
    }

    .qubit {
        display: flex;
        justify-content: space-between;
        grid-column-start: 2;
        grid-column-end: 3;
        position: relative;
        grid-row-start: 1;
        grid-row-end: 3;
        background-color: var(--color-grey-dark);
        border-radius: 10px;
        padding: 1rem 2rem;
    }

    .metrics {
        grid-column-start: 3;
        grid-column-end: 3;
        grid-row-start: 1;
        grid-row-end: 3;
        background-color: var(--color-grey-dark);
        border-radius: 10px;
        padding: 1rem 2rem;
    }

    .axes-sliders {
        grid-column-start: 5;
        grid-column-end: 7;
        grid-row-start: 1;
        grid-row-end: 3;
        display: flex;
    }

    .axes-sliders div {
        transform: rotate(90deg);
    }

    .controls {
        grid-column-start: 2;
        grid-column-end: 2;
        grid-row-start: 3;
        grid-row-end: 4;
        background-color: var(--color-grey-dark);
        border-radius: 10px;
    }
</style>
