<script lang="ts">
    import Presets from '$lib/components/Presets/Presets.svelte';
    import { gates, type Gate } from './gates';


    let focusedGate: null | Gate = null;
</script>

<svelte:head>
	<title>Circuit Designer</title>
	<meta name="description" content="Design custom quantum circuits using a set of gates. Run simulations in the browser." />
</svelte:head>

<section class="buttons container mx-auto">
    <div class="buttons__inner">
        <Presets />
    </div>
</section>

<section class="circuit-designer">
    <aside class="circuit-designer__palette">
        <h2 class="title">gates</h2>
        <div class="circuit-designer__gates">
            {#each $gates as gate}
                <button 
                    on:focus={() => console.log(gate)}
                    on:mouseover={() => focusedGate = gate}
                    on:blur={() => console.log('blur')}
                    on:mouseout={() => focusedGate = null}
                    class="circuit-designer__gate">
                    {gate.symbol}
                </button>
            {/each}
        </div>
        <div class="circuit-designer__instructions">
            {#if focusedGate}
                <h3 class="title">{focusedGate.name}</h3>
                <p>{focusedGate.description}</p>
            {/if}
            {#if !focusedGate}
                <p>Drag and drop gates to design your circuit.</p>
                <p>Hover over a gate to learn more about its properties.</p>
                <p>Individual gate parameters can be set by selecting the gate on the circuit.</p>
            {/if}
        </div>
    </aside>
    <div class="circuit-designer__circuit">
        
    </div>
</section>

<style lang="scss">
    .buttons {
        @media (min-width: 1200px) {
            padding-bottom: 1.5rem;
        }
        background-color: var(--color-grey-mid);
        &__inner {
            padding: 1rem;
            box-shadow: 0 0.5rem 0.5rem 0.25rem var(--color-box-shadow);
            display: flex;
            justify-content: flex-end;
            @media (min-width: 1200px) {
                padding: 1rem 2rem;
            }

        }
	}
    .circuit-designer {
        display: flex;
        padding: 0 2rem 2rem 2rem;
    
        &__palette, &__circuit {
            background-color: var(--color-grey-darker);
            border-radius: 10px;
            padding: 2rem 1rem;
        }
        &__palette {
            width: 20%;
            margin-right: 1rem;
        }

        &__circuit {
            width: 100%;
        }

        &__gates {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            padding: 1rem 0;
            margin-bottom: 1rem;
            border-bottom: 0.5px solid var(--color-grey-light);
        }

        &__gate {
            background-color: var(--color-grey-darkest);
            color: var(--color-theme-1);
            margin-bottom: 0.5rem;
            width: calc(100%/3 - (1rem/3));
            padding: 1.25rem 1rem;
            border-radius: 10px
        }

        &__instructions {
            color: var(--color-grey-lighter);
            font-size: var(--text-sm);
            padding: 1rem 0;

            p {
                margin-bottom: 1rem;
            }
        }
    }
</style>