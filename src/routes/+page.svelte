<script>
    import { instrument, instruments } from '$lib/stores/parameters';
    import Patchbay from '$lib/components/Patching/Patchbay.svelte';

    import Parameters from '$lib/components/Parameters/Parameters.svelte';
    import Controls from '$lib/components/Controls/Controls.svelte';
    import Button from '$lib/components/Button/Button.svelte';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="TODO: please write a description" />
</svelte:head>

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
        <div class="axis">
            <Patchbay ids={['x', 'y', 'z']} title="Axes"/>
        </div>
    </div>

    <div class="controls">
        <Controls />
    </div>

</section>

<style>
	.buttons {
        padding: 0.75rem 2rem;
        background-color: var(--color-grey-mid);
        box-shadow: 0 0 0.5rem var(--color-grey-dark);
	}

    .synth {
        padding: 1.5rem 2rem;
        display: grid;
        grid-template-columns: 3fr 6fr 3fr;
        grid-template-rows: 3fr 1fr;
        grid-gap: 1rem;
        max-height: calc(100vh - 6rem);
        overflow: scroll;
    }

    .parameters {
        display: flex;
        flex-direction: column;
        /* justify-content: space-between; */
        grid-column-start: 1;
        grid-column-end: 1;
        grid-row-start: 1;
        grid-row-end: 3;
    }

    .qubit {
        display: grid;
        grid-column-start: 2;
        grid-column-end: 3;
        position: relative;
        grid-row-start: 1;
        grid-row-end: 2;
    }

    .axis {
        
    }

    .controls {
        grid-column-start: 2;
        grid-column-end: 2;
        grid-row-start: 2;
        grid-row-end: 3;
        
    }
</style>
