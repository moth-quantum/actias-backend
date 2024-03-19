<script lang="ts">
    import { onMount } from 'svelte';
    import { qubits } from '$lib/stores/qubits';
    import Qubit from './Qubit.svelte';
    import Patchbay from '$lib/components/Patching/Patchbay.svelte';
    import Slider from '$lib/components/Sliders/Slider.svelte';
    
    let axesIds = $qubits[0].axes.map(({key}) => key);
    let axesNames = $qubits[0].axes.map(({name}) => name);
    let isDesktop = false;
    
    onMount(() => isDesktop = window.innerWidth > 1200);

    $: activeQubits = $qubits.filter(q => q.active).length;
</script>

<div class="qubits">
    {#each $qubits.filter(q => q.active) as qubit, i}
        <div 
            class="qubit"
            class:qubit--fullHeight={activeQubits < 4}
            class:qubit--single={activeQubits === 1}
            class:qubit--double={activeQubits === 2}
            class:qubit--triple={activeQubits > 2}
        >
            <div class="qubit__qubit">
                <Qubit />
            </div>
            <div class="qubit__patchbay">    
                <Patchbay 
                    ids={axesIds.reverse()} 
                    labels={axesNames.reverse()} 
                />
            </div>
            <div class="qubit__sliders">
                {#each $qubits[0].axes as {value, name, colour} (name)}
                    <Slider 
                        orientation={isDesktop ? 'vertical' : 'horizontal'}
                        {name} {colour}
                        bind:value={value}
                    />
                {/each}
            </div>
        </div>
    {/each}
</div>


<style lang="scss">
    .qubits {
        width: 100%;
        height: 100%;
        max-height: 40rem;
        overflow-y: scroll;
        display: flex;
        flex-wrap: wrap;
    }
    
    .qubit {
        background-color: var(--color-grey-dark);
        display: grid;
        grid-template-rows: 6fr 1fr;
        padding: 2rem;
        border-radius: 10px;
        height: calc(450px + 4rem);

        &--fullHeight {
            height: 100%;
        }

        &--single {
            flex-basis: 100%;
        }

        &--double {
            flex-basis: calc(50% - 0.5rem);
            &:nth-child(2n) {
                margin-left: 1rem;
            }
        }

        &--triple {
            flex-basis: calc(33.3333% - 0.6666rem);
            margin-right: 1rem;
            margin-bottom: 1rem;
            &:nth-child(3n) {
                margin-right: 0rem;
            }
        }
        
        &__qubit {
            grid-row: 1;
            grid-column: 1;
            overflow: hidden;
        }   

        &__patchbay {
            display: flex;
            align-items: flex-end;
            grid-row: 2;
            grid-column: 1;
        }

        &__sliders {
            display: flex;

            height: 100%;
            grid-row: 1 / 3;
            grid-column: 2;

        }
    }
</style>