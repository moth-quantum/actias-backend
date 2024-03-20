<script lang="ts">
    import { onMount } from 'svelte';
    import { qubits } from '$lib/stores/qubits';
    import Qubit from './Qubit.svelte';
    import Patchbay from '$lib/components/Patching/Patchbay.svelte';
    import Slider from '$lib/components/Sliders/Slider.svelte';
    
    let axesIds = $qubits[0].axes.map(({key}) => key);
    let axesNames = $qubits[0].axes.map(({name}) => name);
    let isDesktop = false;
    let windowWidth = window.innerWidth;
    
    onMount(() => isDesktop = window.innerWidth > 1200);

    $: activeQubits = $qubits.filter(q => q.active).length;
    $: isSingle = activeQubits === 1 || windowWidth < 1000;
    $: isDouble = (activeQubits%2 === 0 || windowWidth < 1500) && !isSingle;
    $: isTriple = !isSingle && !isDouble;


</script>

<svelte:window on:resize={() => windowWidth = window.innerWidth} />

<div class="qubits">
    {#each $qubits.filter(q => q.active) as qubit, i}
        <div 
            class="qubit"
            class:qubit--single={isSingle}
            class:qubit--double={isDouble}
            class:qubit--triple={isTriple}
            class:qubit--fullHeight={activeQubits < 4}
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
        max-height: 37rem;
        overflow-y: scroll;
        display: flex;
        flex-wrap: wrap;

    }
    
    .qubit {
        position: relative;
        background-color: var(--color-grey-dark);
        display: grid;
        gap: 1rem;
        grid-template-rows: 1fr;
        grid-template-columns: 1fr;
        padding: 2rem;
        border-radius: 10px;
        height: calc(400px - 1rem);

        &--fullHeight {
            height: 100%;
        }

        &--single {
            flex-basis: 100%;
        }

        &--double {
            flex-basis: calc(50% - 0.5rem);
            margin-bottom: 1rem;
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
            display: flex;
            align-items: center;
            justify-content: center;
            transform: translate(-1rem);
        }   

        &__patchbay {
            display: flex;
            align-items: flex-end;
            grid-row: 1;
            grid-column: 1;
            transform: translate(-1rem);
        }

        &__sliders {
            display: flex;
            margin: 0 0 0 auto;
            transform: translate(1rem);
            height: 100%;
            grid-row: 1 / 3;
            grid-column: 1;

        }
    }
</style>