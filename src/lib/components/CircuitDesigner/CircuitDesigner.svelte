<script lang="ts">
    import Presets from '$lib/components/Presets/Presets.svelte';
    import GateButton from './Gate.svelte';
    import { circuit, gates, type Gate } from '$lib/stores/circuit';
    import { onMount } from 'svelte';
    import { areTouching, clamp } from '$lib/utils/utils';
    import Input from '$lib/components/Forms/Input.svelte';

    let svg: string = "";
    let thisSvg: HTMLDivElement;
    let wire: number = -1;
    let column: number = -1;
    let selectedGateId: string;
    $: gate = circuit.getGateById(selectedGateId);
    $: params = $gates.find(g => g.symbol === gate?.name)?.params;

    const updateSVG = () => {
        svg = circuit.exportSVG(true)
        
        const gates = Array.from(thisSvg?.querySelectorAll(`[data-id]`) || []);
        gates.forEach(el => el.classList.remove('gate--selected'));
        const selectedGate = thisSvg?.querySelector(`[data-id="${selectedGateId}"]`);
        selectedGate && selectedGate.classList.toggle('gate--selected');
    };

    const handleDrag = (x: number, y: number) => {
        const wires = Array.from(thisSvg.querySelectorAll('svg line.qc-wire'));
        const svg = thisSvg.querySelector('svg')?.getBoundingClientRect()
        if(!svg || !wires) return;
        const numOfColumns = circuit.gates[0].length;

        const iconSize = 20;
        const { index: closestWireIndex } = wires.reduce((closest, wire, index) => {
            const wireRect = wire.getBoundingClientRect();
            const wireX = wireRect.left + wireRect.width / 2;
            const wireY = wireRect.top + wireRect.height / 2;
            const distance = Math.sqrt((x + iconSize / 2 - wireX) ** 2 + (y + iconSize / 2 - wireY) ** 2);

            return distance < closest.distance ? { distance, index } : closest;
        }, { distance: Infinity, index: -1 });

        const columnWidth = ((svg.width || 0) - 38 - 20) / numOfColumns; // Subtracting 40px for labels on the left and 20px for the margin on the right
        
        wire = closestWireIndex;
        column = clamp(Math.floor((x - svg.x) / columnWidth), 1, numOfColumns);
    }

    const handleDragEnd = (i: number, pointerX: number, pointerY: number) => {
        if(!thisSvg) return;
        const {x, y, width, height} = thisSvg.getBoundingClientRect();
        const svg = {x: x, y: y, width: width, height: height};
        const pointer = {x: pointerX, y: pointerY, width: 20, height: 20};
        if(!areTouching(pointer, svg)) return;

        const gate = $gates[i];
        const wires = Array.from({ length: gate.qubits }, (_, i) => (wire + i) % circuit.numQubits);

        wires.length > 1
            ? circuit.insertGate(gate.symbol, column, wires)
            : circuit.addGate(gate.symbol, column, wires);
        
        updateSVG() 
        wire = -1;
        column = -1;
    }

    const handleClick = (e: MouseEvent) => {
        const target = e.target;
        const parent = target?.parentElement;
        const gateType = target?.dataset?.gate || parent?.dataset.gate;
        // if (gateType === 'u3') return;
        
        selectedGateId = target?.dataset?.id || parent?.dataset.id || '';
        
        updateSVG();
    }

    const handleParamChange = (param: string, value: number) => {
        const gate = circuit.getGateById(selectedGateId);
        const { id, column } = gate;
        circuit.gates.forEach((gates: any) => {
            if(id !== gates[column].id) return;
            gates[column].options.params[param] = value;
        });
        
        updateSVG();
    }

    onMount(() => {        
        updateSVG()

        const handleKeydown = (e: KeyboardEvent) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                circuit.removeGate(selectedGateId);
                updateSVG();
            }
        }

        window.addEventListener('keydown', handleKeydown);

        return () => window.removeEventListener('keydown', handleKeydown);
    });

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
        <h2 class="title">Gates</h2>
        <div 
            class="circuit-designer__gates"
        >
            {#each $gates as gate, i}
                <GateButton 
                    id={i}
                    symbol={gate.symbol}
                    on:mouseover={() => focusedGate = gate}
                    on:mouseout={() => focusedGate = null}
                    on:drag={(e) => {
                        const { x, y } = e.detail;
                        handleDrag(x, y)
                    }}
                    on:dragend={(e) => {
                        const { id, x, y } = e.detail;
                        handleDragEnd(id, x, y)
                    }}
                    on:dragstart={() => {}}
                    disabled={gate.qubits > circuit.numQubits}
                />
            {/each}
        </div>
        <div class="circuit-designer__instructions">
            {#if gate && params?.length}
                <p>This gate accepts the following additional parameters (in radians):</p>
                
                {#each params as param}
                    <div class="circuit-designer__input">
                        <Input 
                            id={param.name} 
                            label={param.name} 
                            bind:value={gate.options.params[param.name]}
                            type={param.type}
                            on:change={(e) => handleParamChange(param.name, e.detail)}
                        />
                    </div>
                {/each}
            {/if}
            {#if !gate || !params?.length}
                {#if focusedGate}
                    <h3 class="title">{focusedGate.name}</h3>
                    <p>{focusedGate.description}</p>
                {/if}
                {#if !focusedGate}
                    <p>Drag and drop gates to design your circuit.</p>
                    <p>Hover over a gate to learn more about its properties.</p>
                    <p>Individual gate parameters can be set by selecting the gate on the circuit.</p>
                {/if}
            {/if}
        </div>
    </aside>
    <div class="circuit-designer__circuit">
        {#if svg}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div 
                bind:this={thisSvg}
                class="circuit-designer__svg"
                on:click={handleClick}
            >
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
            width: 100%;
            overflow: scroll;
        }

        &__input {
            display: flex;
            flex-direction: column;
            margin-bottom: 1rem;
        }
    }
</style>