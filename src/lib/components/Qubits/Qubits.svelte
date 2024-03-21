<script lang="ts">
    import { qubits } from '$lib/stores/qubits';
    import Qubit from './Qubit.svelte';
    import Patchbay from '$lib/components/Patching/Patchbay.svelte';
    import Slider from '$lib/components/Sliders/Slider.svelte';
    
    let axesIds = $qubits[0].axes.map(({key}) => key);
    let axesNames = $qubits[0].axes.map(({name}) => name);
    let windowWidth = window.innerWidth;
    let qubitSize: 'sm' | 'md' | 'lg' = 'md';

    $: activeQubits = $qubits.filter(q => q.active).length;
    $: isSingle = activeQubits === 1 || windowWidth < 1000;
    $: isDouble = (activeQubits%2 === 0 || activeQubits === 3 || windowWidth < 1500) && !isSingle;
    $: isTriple = !isSingle && !isDouble;
    $: isFullHeight = (activeQubits === 1 && windowWidth > 1000) 
        || (activeQubits === 2 && windowWidth > 1000);
    $: qubitSize = (isSingle && isFullHeight && 'lg') 
        || (isDouble && 'md') 
        || (isTriple && 'sm') 
        || 'md';

</script>

<svelte:window on:resize={() => windowWidth = window.innerWidth} />

<div class="qubits">
    {#each $qubits.filter(q => q.active) as qubit, i}
        <div 
            class="qubit"
            class:qubit--single={isSingle}
            class:qubit--double={isDouble}
            class:qubit--triple={isTriple}
            class:qubit--full-height={isFullHeight}
        >
            <div class="qubit__qubit">
                <Qubit 
                    id={i}
                    size={qubitSize}
                    bind:phi={$qubits[i].axes[1].value}
                    bind:theta={$qubits[i].axes[2].value}
                    bind:phase={$qubits[i].axes[0].value}
                />
            </div>
            <div class="qubit__patchbay">    
                <Patchbay 
                    ids={axesIds.reverse()} 
                    labels={axesNames.reverse()} 
                />
            </div>
            <div class="qubit__sliders">
                {#each $qubits[i].axes as {value, name, colour} (name)}
                    <Slider
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
        @media (max-width: 1200px) {
            height: calc(100% - 4rem);
            padding: 1rem;
        }
    }

    .qubit {
        position: relative;
        box-sizing: border-box;
        background-color: var(--color-grey-dark);
        display: grid;
        gap: 1rem;
        grid-template-rows: 1fr;
        grid-template-columns: 1fr;
        border-radius: 10px;
        height: calc(400px - 1rem);
        margin-bottom: 1rem;
        &:last-of-type {
            margin-bottom: 0;
        }

        &--full-height {
            height: 100%;
            margin-bottom: 0;
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
        }   

        &__patchbay {
            display: flex;
            align-items: flex-end;
            grid-row: 1;
            grid-column: 1;
            padding-bottom: 1rem;
        }

        &__sliders {
            display: flex;
            margin: 0 0 0 auto;
            padding: 1rem 1rem 2rem;
            height: 100%;
            grid-row: 1 / 3;
            grid-column: 1;

        }
    }
</style>