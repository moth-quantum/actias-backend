<script>
    import { parameters, fxParameters, globalParameters } from '$lib/stores/parameters';
    import RangeSlider from '$lib/components/RangeSlider.svelte';
    import Socket from '$lib/components/Patching/Socket.svelte';

</script>

<div class="group">
    <h2>Instrument</h2>
    {#each $parameters as parameter}
        <div class="parameter">
            <h3>{parameter.key}</h3>
            <RangeSlider 
                classes={"mr-4"} 
                min={parameter.min} 
                max={parameter.max} 
                step={parameter.step} 
                units={parameter.units} 
                rangeA={parameter.rangeA}
                rangeB={parameter.rangeB} 
                value={parameter.value}
            />
            <Socket id={parameter.key} type="origin" align="right"/>
        </div>
    {/each}
</div>

<div class="group">
    <h2>Global</h2>
    {#each globalParameters as parameter}
        <div class="parameter">
            <h3>{parameter.key}</h3>
            <RangeSlider 
                classes={"mr-4"} 
                min={parameter.min} 
                max={parameter.max} 
                step={parameter.step} 
                units={parameter.units} 
                rangeA={parameter.rangeA}
                rangeB={parameter.rangeB} 
                value={parameter.value}
            />
            <Socket id={parameter.key} type="origin" align="right"/>
        </div>
    {/each}
</div>

<div class="group">
    <h2>Effects</h2>
    {#each fxParameters as parameter}
        <div class="parameter">
            <h3>{parameter.key}</h3>
            <RangeSlider 
                classes={"mr-4"} 
                min={parameter.min} 
                max={parameter.max} 
                step={parameter.step} 
                units={parameter.units} 
                rangeA={parameter.rangeA}
                rangeB={parameter.rangeB} 
                value={parameter.value}
            />
            <Socket id={parameter.key} type="origin" align="right"/>
        </div>
    {/each}
</div>

<style>
    .parameter {
        display: grid;
        grid-template-columns: 2fr 9fr 1fr;
        margin-bottom: 0rem;
    }

    .parameter:nth-child(1) {
        grid-column: 1;
        
    }

    h3 {
        display: flex;
        align-items: center;
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
    }

    .group:last-of-type {
        margin-bottom: 0;
    }

    h2 {
        padding-bottom: 0.25rem;
        margin-bottom: 0.5rem;
        border-bottom: 0.5px solid var(--color-grey-light);
    }


</style>