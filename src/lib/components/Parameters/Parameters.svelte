<script>
    import { instrumentParameters, fxParameters, globalParameters, paramValues, randomise, keys } from '$lib/stores/parameters';
    import { axes } from '$lib/stores/qubit';
    import RangeSlider from '$lib/components/Sliders/RangeSlider.svelte';
    import Socket from '$lib/components/Patching/Socket.svelte';
    import Buttons from '$lib/components/Patching/Buttons.svelte';
    export let showSockets = true;

    let axesIds = $axes.map(({key}) => key);
</script>

<div class="group">
    <button on:click={() => randomise('inst')}>
        <h2>Instrument</h2>
    </button>
    {#each $instrumentParameters.filter(({key}) => $keys.includes(key)) 
        as {name, min, max, step, units, key, rangeA, rangeB} (key)
    }
        <div class="parameter">
            <h3>{name}</h3>
            <RangeSlider 
                {min} {max} {step} {units} 
                value={$paramValues[key]}
                bind:rangeA={rangeA} 
                bind:rangeB={rangeB} 
            />
            {#if showSockets}
                <Socket id={key} type="origin" align="right"/>
            {:else}
                <Buttons id={key} options={axesIds}/>
            {/if}
        </div>
    {/each}
</div>

<div class="group">
    <button on:click={() => randomise('global')}>
        <h2>Global</h2>
    </button>
    {#each $globalParameters as {name, min, max, step, units, key, rangeA, rangeB} (key)}
        <div class="parameter">
            <h3>{name}</h3>
            <RangeSlider 
                {min} {max} {step} {units} 
                value={$paramValues[key]}
                bind:rangeA={rangeA} 
                bind:rangeB={rangeB} 
            />
            {#if showSockets}
                <Socket id={key} type="origin" align="right"/>
            {:else}
                <Buttons id={key} options={axesIds}/>
            {/if}
        </div>
    {/each}
</div>

<div class="group">
    <button on:click={() => randomise('fx')}>
        <h2>Effects</h2>
    </button>

    {#each $fxParameters as {name, min, max, step, units, key, rangeA, rangeB} (key)}
        <div class="parameter">
            <h3>{name}</h3>
            <RangeSlider 
                {min} {max} {step} {units} 
                value={$paramValues[key]}
                bind:rangeA={rangeA} 
                bind:rangeB={rangeB} 
            />
            {#if showSockets}
                <Socket id={key} type="origin" align="right"/>
            {:else}
                <Buttons id={key} options={axesIds}/>
            {/if}
        </div>
    {/each}
</div>

<style lang="scss">
    .parameter {
        display: grid;
        grid-template-columns: 2fr 7fr 3fr;
        @media (min-width: 1200px) {
            grid-template-columns: 2fr 9fr 1fr;
        }
        margin-bottom: 0rem;
    }

    .parameter:nth-child(1) {
        grid-column: 1;
    }
    
    h2 {
        padding-bottom: 0.25rem;
        margin-bottom: 0.5rem;
        border-bottom: 0.5px solid var(--color-grey-light);
        cursor: pointer;
    }
    
    h2:hover {
        color: var(--color-theme-2);
    }
    h3 {
        display: flex;
        align-items: center;
        word-break: break-word;
        word-spacing: 50000px; 
    }

    .parameter:nth-child(2) {
        grid-column: 2;
    }

    .parameter:nth-child(3) {
        grid-column: 3;
    }

    .parameter:last-of-type {
        margin-bottom: 0;
    }

    .group {
        margin-bottom: 1rem;
        & > button {
            width: 100%;
            text-align: left;
        }
    }

    .group:last-of-type {
        margin-bottom: 0;
    }
</style>