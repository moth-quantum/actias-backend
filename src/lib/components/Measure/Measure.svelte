<script lang="ts">
    import Select from '$lib/components/Forms/Select.svelte';   
    import { measure, seconds, source, isMeasuring, resetAfterMeasuring } from '$lib/stores/qubits';
    import { isApp } from '$lib/stores/global';
    import Lottie from '$lib/components/Lottie/Lottie.svelte';
    import lottieSrc from '$lib/images/measuring.json';
    import Tooltip from '$lib/components/Tooltip/Tooltip.svelte';
    import Learnable from '$lib/components/Learnable/Learnable.svelte';
    import Checkbox from '$lib/components/Forms/Checkbox.svelte';
    
    const machines = [
        {name: 'local', value: 'local', active: true}, 
        {name: 'ibmq_belem', value: 'ibmq_belem', active: false},
    ];
</script>

<div class="measure">
    <h2 class="title">Measure</h2>
    <form>
        {#if isApp()}
            <div class="source">
                <div>
                    <Select 
                        id="source" 
                        options={machines} 
                        selected={'local'}
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
        <Checkbox 
            bind:checked={$resetAfterMeasuring} 
            onChange={checked => resetAfterMeasuring.set(checked)} 
            label="Reset to |0⟩"
        />
    </form>
    <div class="button">
        <Tooltip element="measure">
            <Learnable id="measure" classes="w-full h-full">
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
            </Learnable>
        </Tooltip>
    </div>
</div>

<style lang="scss">
    .measure {
        padding-top: 1rem;
        width: 100%;
        height: 100%;
        display: flex;
        @media (min-width: 1000px) {
            flex-direction: column;
            padding: 0;
        }
    }
    h2 {
        display: none;
        @media (min-width: 1000px) {
            display: block;
        }
    }

    form {
        display: flex;
        flex-wrap: wrap;
        width: 70%;
        @media (min-width: 1000px) {
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
        margin-bottom: 0.5rem;
        &#seconds {
            flex-basis: 100%;
        }

        @media (min-width: 1000px) {
            max-height: 2rem;
        }

    }

    input::placeholder {
        color: var(--color-grey-mid);
    }

    .source {
        width: 100%;
        margin-bottom: 0.5rem;
        display: flex;
        max-height: 2rem;

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
        
        @media (min-width: 1000px) {
            margin-left: 0;
            height: 170%;
            width: 100%;
        }
    }

</style>