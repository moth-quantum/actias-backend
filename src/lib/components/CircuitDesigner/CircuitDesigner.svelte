<script lang="ts">
    import { qubits } from '$lib/stores/qubits';
    import Presets from '$lib/components/Presets/Presets.svelte';
    import { circuit, gates, type Gate } from '$lib/stores/circuit';
    import { onMount } from 'svelte';
    import { debounce } from '$lib/utils/utils';

    let svg: string = "";

    const createQubit = (i: number, theta: number, phi: number, lambda: number) => {
        circuit.appendGate("u3", i, {
            params: {
                theta: theta * (Math.PI/2),
                phi: phi * (Math.PI/2),
                lambda: lambda * (Math.PI/2)
            }
        });
    }

    const updateQubit = (i: number, theta: number, phi: number, lambda: number) => {
        circuit.gates[i][0].options.params.theta = theta * (Math.PI/2);
        circuit.gates[i][0].options.params.phi = phi * (Math.PI/2);
        circuit.gates[i][0].options.params.lambda = lambda * (Math.PI/2);
    }

    const removeQubit = (i: number) => {
        circuit.gates.splice(i, 1);
        circuit.numQubits = circuit.gates.length;
    }

    const updateSVG = debounce(() => {
        svg = circuit.exportSVG(true);
    }, 100)

    onMount(() => {        
        const unsubscribeQubits = qubits.subscribe(qubits => {
            qubits.forEach((q, i) => {
                if(!q.active) return removeQubit(i);
                
                // initialise new qubits with u3 gates
                !circuit.gates[i] || circuit.gates[i].length === 0
                    ? createQubit(i, q.axes[2].value, q.axes[1].value, q.axes[0].value)
                    : updateQubit(i, q.axes[2].value, q.axes[1].value, q.axes[0].value);                

                console.log(circuit)
            });

            circuit.appendGate("cx", [0, 3]);
                        
            updateSVG()
        });

        return () => unsubscribeQubits();
    });

    let focusedGate: null | Gate = null;
    $: svgDataURL = `data:image/svg+xml;base64,${btoa(svg)}`;
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
        <!-- TODO: render as image using data url so that you can resize it... -->
        {#if svg}
            <div class="circuit-designer__svg">
                {@html svg}
            </div>
        {/if}
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
        min-height: 80vh;
        height: 100%;
        background-color: var(--color-grey-mid);

        padding: 2rem;
        @media (min-width: 1200px) {
            padding: 0 2rem 2rem 2rem;
        }
    
        &__palette, &__circuit {
            background-color: var(--color-grey-darker);
            border-radius: 10px;
            padding: 2rem;
        }
        &__palette {
            width: 30%;
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
            padding: 1.25rem 0;
            border-radius: 10px;
            width: calc(100%/2 - 0.25rem);
            @media (min-width: 1200px){
                width: calc(100%/3 - (1rem/3));
            }
        }

        &__instructions {
            color: var(--color-grey-lighter);
            font-size: var(--text-sm);
            padding: 1rem 0;

            p {
                margin-bottom: 1rem;
            }
        }

        &__circuit {
            padding: 2rem 4rem;
            display: flex;
            justify-content: flex-start;
        }

        &__svg {
            width: 100%;
            height: 100%;
            overflow: scroll;
        }
    }
</style>