<script>
    import Select from '$lib/components/Forms/Select.svelte';   
    import { measure, seconds, bpm, beats, source, password } from '$lib/stores/qubit';
    import { mute } from '$lib/stores/global';
</script>

<div class="measure">
    <h2>Measure</h2>
    <form>
        <div class="source">
            <div>
                <Select id="source" options={['local', 'qasm_simulator', 'ibmq_qasm_simulator']} onChange={e => source.update(() => e.target?.value || 'local')} />
            </div>
            {#if $source !== 'local'}
                <div>
                    <input 
                        id="password" 
                        placeholder="Password" 
                        type="password" 
                        bind:value={$password}
                        on:focus={() => mute.set(true)}
                        on:focusout={() => mute.set(false)}
                    />
                </div>
            {/if}
        </div>
        <input 
            id="seconds" placeholder="Seconds" type="number" 
            bind:value={$seconds}
            on:focus={() => mute.set(true)}
            on:focusout={() => mute.set(false)}
        />
        <input 
            id="bpm" placeholder="BPM" type="number" 
            bind:value={$bpm}
            on:focus={() => mute.set(true)}
            on:focusout={() => mute.set(false)}
        />
        <input 
            id="beats" placeholder="Beats" type="number" 
            bind:value={$beats}
            on:focus={() => mute.set(true)}
            on:focusout={() => mute.set(false)}
        />
    </form>
    <div class="button">
        <button
            on:click|preventDefault={() => measure()}
        >Measure</button>
    </div>
</div>

<style lang="scss">
    .measure {
        padding: 1rem 1rem;
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
        padding-bottom: 0.25rem;
        margin-bottom: 0.5rem;
        border-bottom: 0.5px solid var(--color-grey-light);

        @media (min-width: 1200px) {
            display: block;
        }
    }

    form {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 0.5rem;
        grid-template-rows: 1fr 1fr 1fr;
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
        height: 100%;
        border-radius: 5px;
    }

    input::placeholder {
        color: var(--color-grey-mid);
    }

    .source {
        grid-column: 1 / 3;
        display: flex;

        & > div{
            width: 100%;
            height: 100%;

            &:nth-of-type(2n) {
                margin-left: 0.5rem;
            }
        }
    }

    #seconds {
        grid-column: 1 / 3;
        grid-row: 2;
    }

    #bpm {
        grid-column: 1;
        grid-row: 3;
    }

    #beats {
        grid-column: 2;
        grid-row: 3;
    }

    .button {
        width: 30%;
        margin-left: 0.5rem;

        @media (min-width: 1200px) {
            margin-left: 0;
            width: 100%;
        }
        button {
            grid-column: 1 / 3;
            grid-row: 4 / 6;
            background-color: #939393;
            font-size: var(--text-base);
            color: var(--color-yellow);
            text-transform: uppercase;
            border: 0;
            border-radius: 5px;
            padding: 1.75rem 0.75rem;
            width: 100%;
            height: 100%;
            font-weight: 600;
            cursor: pointer;
        }

    }

</style>