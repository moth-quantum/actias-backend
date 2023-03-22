<script>
    import { envelopes } from '$lib/stores/envelopes';
    import { volume } from '$lib/stores/global';
    import Knob from '$lib/components/Knob.svelte';
    import Keyboard from '$lib/components/Keyboard/Keyboard.svelte';
    import Button from '$lib/components/Button/ButtonLarge.svelte';
</script>

<div class="controls">
    <h2 class="visually-hidden">Controls</h2>
    <div class="buttons">
        <Button text="Midi" colour="primary" />
        <Button text="Drone" colour="secondary" />
    </div>
    <div class="keysAndKnobs">
        <Keyboard />
        <div class="knobs">
            <div class="volume">
                <h3 class="knobs__title">Vol</h3>
                <Knob name="Volume" pixelRange={200} bind:value={$volume}/>
            </div>
            {#each $envelopes as envelope}
                <div class="envelope">
                    <h3 class="knobs__title">{envelope.name}</h3>
                    {#each Object.entries(envelope.values) as [name, value]}
                        <Knob bind:value={value} pixelRange={200} name={name}/>
                    {/each}
                </div>
            {/each}
        </div>
    </div>
</div>
        
<style>
    .controls {
        display: flex;
        background-color: var(--color-grey-dark);
        border-radius: 5px;
        padding: 1rem 2rem;
    }

    .buttons {
        display: flex;
        flex-direction: column;
        width: 4.5rem;
        margin-right: 1.5rem;
    }

    .knobs {
        display: flex;
    }

    .knobs__title {
        writing-mode: vertical-rl;
        text-orientation: sideways;
    }

    .volume, .envelope {
        display: flex;
        align-items: center;
        margin-bottom: 0.5rem;
    }
</style>