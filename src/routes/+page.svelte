<script>
    import { ButtonGroup, Button } from 'flowbite-svelte';
    import { Card } from "flowbite-svelte";
    import { parameters, fxParameters, loadInstrument } from '$lib/stores/parameters';
    import RangeSlider from '$lib/components/RangeSlider.svelte';
    import Socket from '$lib/components/Patching/Socket.svelte';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="TODO: please write a description" />
</svelte:head>

<section class="buttons container mx-auto">
    <ButtonGroup>
        <Button on:click={() => loadInstrument('fm')} active={true}>FM</Button>
        <Button on:click={() => loadInstrument('granular')}>Granular</Button>
        <Button on:click={() => loadInstrument('subtractive')}>Subtractive</Button>
    </ButtonGroup>
</section>

<section class="synth container mx-auto">
    <Card>
        <h2>Parameters</h2>
        {#each $parameters as parameter}
            <h3>{parameter.name}</h3>
            <div class="parameter">
                <RangeSlider classes={"mr-4"} value={parameter.value}/>
                <Socket id={parameter.key} type="local" />
            </div>
        {/each}
    </Card>
    <Card>
        <h2>FX</h2>
        {#each fxParameters as parameter}
            <h3>{parameter.name}</h3>
            <div class="parameter">
                <RangeSlider classes={"mr-4"} value={parameter.value}/>
                <Socket id={parameter.key} type="local" />
            </div>
        {/each}
    </Card>
</section>


<style>
	.buttons {
        padding: 0.5rem 0;
	}

    .synth {

    }

    .parameter {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.5rem;
    }
</style>
