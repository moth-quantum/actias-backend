<script>
    import { envelopes } from '$lib/stores/envelopes';
    import { volume } from '$lib/stores/global';
    import Knob from '$lib/components/Knob/Knob.svelte';
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
            <span>
                <h3 class="knobs__title">Vol</h3>
            </span>
            <Knob name="Volume" pixelRange={200} bind:value={$volume}/>
            {#each $envelopes as {name, a, d, s, r}}
                <span>
                    <h3 class="knobs__title">{name}</h3>
                </span>
                <Knob bind:value={a} pixelRange={200} min={0.01} name="a"/>
                <Knob bind:value={d} pixelRange={200} min={0.01} name="d"/>
                <Knob bind:value={s} pixelRange={200} min={0.01} name="s"/>
                <Knob bind:value={r} pixelRange={200} min={0.01} name="r"/>
            {/each}
        </div>
    </div>
</div>
        
<style>
    .controls {
        display: flex;
        padding: 1rem 2rem;
        height: 100%;
        min-height: 14rem;
    }

    .buttons {
        display: flex;
        flex-direction: column;
        width: 4.5rem;
        margin-right: 1.5rem;
    }

    .keysAndKnobs {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .knobs {
        margin-top: 1.5rem;
        display: flex;
        width: 100%;
        justify-content: space-between;
    }

    span {
        height: 100%;
        display: flex;
        align-items: center;
        border-left: 1px solid var(--color-grey-light);
        padding: 0 0 0 0.5rem;
    }

    .knobs__title {
        writing-mode: vertical-rl;
        text-orientation: sideways;
        color: var(--color-grey-light);
        transform: rotate(180deg);
        font-size: var(--text-sm);
    }
</style>