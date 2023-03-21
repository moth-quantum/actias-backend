<script>
    import { parameters, fxParameters, globalParameters } from '$lib/stores/parameters';
    import RangeSlider from '$lib/components/RangeSlider.svelte';
    import Socket from '$lib/components/Patching/Socket.svelte';

</script>

<div class="group">
    <h2>Instrument</h2>
    {#each $parameters as parameter}
        <h3>{parameter.name}</h3>
        <div class="parameter">
            <RangeSlider classes={"mr-4"} value={parameter.value}/>
            <Socket id={parameter.key} type="origin" />
        </div>
    {/each}
</div>

<div class="group">
    <h2>Global</h2>
    {#each globalParameters as parameter}
        <h3>{parameter.name}</h3>
        <div class="parameter">
            <RangeSlider classes={"mr-4"} value={parameter.value}/>
            <Socket id={parameter.key} type="origin" />
        </div>
    {/each}
</div>

<div class="group">
    <h2>Effects</h2>
    {#each fxParameters as parameter}
        <h3>{parameter.name}</h3>
        <div class="parameter">
            <RangeSlider classes={"mr-4"} value={parameter.value}/>
            <Socket id={parameter.key} type="origin" />
        </div>
    {/each}
</div>

<style>
    .parameter {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.5rem;
    }

    .parameter:last-of-type {
        margin-bottom: 0;
    }

    .group {
        margin-bottom: 2rem;
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