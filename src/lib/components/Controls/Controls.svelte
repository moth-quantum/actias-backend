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
    <div class="controller">
        <Keyboard />
        <div class="knobs">
            <div class="volume">
                <span>
                    <h3 class="knobs__title">Vol</h3>
                </span>
                <Knob name="Vol" pixelRange={200} bind:value={$volume}/>
            </div>
            {#each $envelopes as {name, a, d, s, r}, i}
                <div class={`envelope envelope__${i}`}>
                    <span>
                        <h3 class="knobs__title">{name}</h3>
                    </span>
                    <Knob bind:value={a} pixelRange={200} min={0.01} name="a"/>
                    <Knob bind:value={d} pixelRange={200} min={0.01} name="d"/>
                    <Knob bind:value={s} pixelRange={200} min={0.01} name="s"/>
                    <Knob bind:value={r} pixelRange={200} min={0.01} name="r"/>
                </div>
            {/each}
        </div>
    </div>
</div>
        
<style lang="scss">
    .controls {
        display: flex;
        padding: 1rem;
        overflow-x: scroll;
        @media (min-width: 1200px) {
            padding: 1rem 2rem;
        }
        height: 100%;
        min-height: 14rem;
    }

    .buttons {
        display: flex;
        flex-direction: column;
        margin-right: 1rem;
        width: 4rem;
        @media (min-width: 400px) {
            width: 8rem;
        }
        @media (min-width: 650px) {
            width: 10rem;
            margin-right: 1.5rem;
        }
        @media (min-width: 1200px) {
            width: 4.5rem;
        }
    }

    .controller {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .knobs {
        display: grid;
        grid-template-columns: 1fr 3fr;
        grid-template-rows: 1fr 1fr;
        width: 100%;
        margin-top: 1.5rem;
        background: linear-gradient(var(--color-grey-dark), #454545, var(--color-grey-dark));

        @media (min-width: 650px) {
            display: flex;
            justify-content: space-between;
        }

        &__title {
            writing-mode: vertical-rl;
            text-orientation: sideways;
            color: var(--color-grey-light);
            transform: rotate(180deg);
            font-size: var(--text-sm);
        } 

        & .volume, & .envelope {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
        }

        & .volume {
            grid-column: 1;
            grid-row: 1 / 3;
            margin-bottom: 0;
            justify-content: start;

            & > span {
                margin-right: 1rem;
            }

            @media (min-width: 650px) {
                width: 16.66%;
                margin-bottom: 0.5rem;
                justify-content: space-between;

                & > span {
                   margin-right: 0;
                }
            }
        }

        & .envelope {
            margin-left: 1rem;
            grid-column-start: 2;
            grid-column-end: 3;
            @media (min-width: 650px) {
                width: 41.66%;
            }

            &:last-of-type {
                margin-bottom: 0;
            }
        }
    }

    span {
        height: 100%;
        display: flex;
        align-items: center;
        border-left: 1px solid var(--color-grey-light);
        padding: 0 0 0 0.5rem;
    }
</style>