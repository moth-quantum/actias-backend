<script lang="ts">
    import Select from '$lib/components/Forms/Select.svelte';   
    import { measure, seconds, bpm, beats, source, isMeasuring } from '$lib/stores/qubits';
    import { isApp } from '$lib/stores/global';
    import Lottie from '$lib/components/Lottie/Lottie.svelte';
    import lottieSrc from '$lib/images/measuring.json';
    import Tooltip from '$lib/components/Tooltip/Tooltip.svelte';
    import Learnable from '$lib/components/Learnable/Learnable.svelte';
    
    const machines = [
        {name: 'local', active: true}, 
        // {name: 'qasm_simulator', active: false}, 
        // {name: 'ibmq_belem', active: false}
    ];
</script>

<div class="measure">
    <Learnable id="measure">
        <h2 class="title">Measure</h2>
    </Learnable>
    <form>
        {#if isApp()}
            <div class="source">
                <div>
                    <Select 
                        id="source" 
                        options={machines} 
                        onChange={e => source.update(() => {
                            // @ts-ignore
                            return e.target?.value || 'local'
                        })} 
                    />
                </div>
            </div>
        {/if}
        <input 
            id="seconds" placeholder="Seconds" type="number" 
            bind:value={$seconds}
            on:keydown={e => e.stopPropagation()}
        />
        <input 
            id="bpm" placeholder="BPM" type="number" 
            bind:value={$bpm}
            on:keydown={e => e.stopPropagation()}
        />
        <input 
            id="beats" placeholder="Beats" type="number" 
            bind:value={$beats}
            on:keydown={e => e.stopPropagation()}
        />
    </form>
    <div class="button">
        <Tooltip element="measure">
            <button
                on:click|preventDefault={() => measure()}
                disabled={$isMeasuring}
            >
                {#if $isMeasuring}
                    <Lottie src={lottieSrc} />
                {:else}
                    <span class="button__text">Measure</span>
                {/if}
            </button>
        </Tooltip>
    </div>
</div>

<style lang="scss">
    .measure {
        padding-top: 1rem;
        // @media (min-width: 1200px) {
        //     padding: 1rem 0 0;
        // }
        width: 100%;
        height: 100%;
        display: flex;
        @media (min-width: 1200px) {
            flex-direction: column;
            padding: 0;
        }
    }
    h2 {
        display: none;
        @media (min-width: 1200px) {
            display: block;
        }
    }

    form {
        display: flex;
        flex-wrap: wrap;
        width: 70%;
        height: 100%;
        @media (min-width: 1200px) {
            width: 100%;
            margin-bottom: 0.5rem;
        }
    }

    input {
        font-size: var(--text-sm);
        color: var(--color-grey-mid);
        text-transform: uppercase;
        padding: 0.125rem 0.75rem;
        width: 100%;
        border-radius: 5px;

        &#seconds {
            flex-basis: 100%;
            margin-bottom: 0.5rem;
        }
        &#bpm, &#beats {
            flex-basis: calc(50% - 0.25rem);
        }

        &#bpm {
            margin-right: 0.5rem;
        }
    }

    input::placeholder {
        color: var(--color-grey-mid);
    }

    .source {
        width: 100%;
        margin-bottom: 0.5rem;
        display: flex;

        & > div {
            width: 100%;
            height: 100%;
            margin-right: 0.5rem;

            &:last-of-type {
                margin-right: 0;
            }
        }
    }

    .button {
        width: 30%;
        margin-left: 0.5rem;

        &__text {
            display: block;
            padding: 1rem;
            letter-spacing: 0.0625rem;
        }

        @media (min-width: 1200px) {
            margin-left: 0;
            height: 150%;
            width: 100%;
        }
        button {
            background-color: var(--color-grey-light);
            font-size: var(--text-base);
            color: var(--color-yellow);
            text-transform: uppercase;
            border: 0;
            border-radius: 5px;
            width: 100%;
            height: 100%;
            font-weight: 600;
            cursor: pointer;
            &:disabled {
                cursor: not-allowed;
            }
        }

    }

</style>