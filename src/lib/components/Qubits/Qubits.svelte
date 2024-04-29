<script lang="ts">
    import { qubits, axes, activeQubitCount, isMeasuring } from '$lib/stores/qubits';
    import { redrawCables } from '$lib/stores/patching';
    import Qubit from './Qubit.svelte';
    import Patchbay from '$lib/components/Patching/Patchbay.svelte';
    import Slider from '$lib/components/Sliders/Slider.svelte';
    import { debounce } from '$lib/utils/utils';
    import { getUserColour, getUserName } from '$lib/stores/users';
    import { isApp } from '$lib/stores/global';
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';
    
    let axesIds = ['x', 'y', 'z'];
    let axesNames = ['λ', 'φ', 'θ'];
    let windowWidth: number;

    const handleScroll = debounce(() => redrawCables(), 1);

    const handleSliderChange = (e: CustomEvent, qubit: number, axis: number) => {
        axes[qubit].update(axes => {
            axes[axis] = e.detail;
            return axes;
        });
    }

    $: isSingle = $activeQubitCount === 1 || windowWidth < 1000;
    $: isDouble = ($activeQubitCount%2 === 0 || $activeQubitCount === 3 || windowWidth < 1500) && !isSingle;
    $: isTriple = !isSingle && !isDouble;
    $: isFullHeight = ($activeQubitCount === 1 && windowWidth > 1000) 
        || ($activeQubitCount === 2 && windowWidth > 1000);
    
    // let positions: {[key: number]: number[]} = {
    //     0: [0, 0, 0],
    // }

    onMount(() => {
        windowWidth = window.innerWidth;
        // let unsubscribeAxes: any[] = [];
        // axes.forEach((store, i) => {
        //     unsubscribeAxes.push(store.subscribe(values => {
        //         positions[i] = values;
        //     }));
        // })

        // return () => {
        //     unsubscribeAxes.map(cb => cb());
        // }
    });

</script>

<svelte:window on:resize={() => windowWidth = window.innerWidth} />

<div 
    class="qubits"
    on:scroll={() => handleScroll()}
>
    {#each $qubits.filter(q => q.active) as qubit, i}
        <div 
            class="qubit"
            class:qubit--single={isSingle}
            class:qubit--double={isDouble}
            class:qubit--triple={isTriple}
            class:qubit--full-height={isFullHeight}
            class:qubit--border={qubit.user !== 'you'}
            style="border-color: {getUserColour(qubit.user)};"

        >
            {#if isApp()}
                <h3 class="qubit__info">
                    <span style="background-color: {getUserColour(qubit.user)}">{(i + 1).toString().padStart(2, '0')}</span>
                    <span style="background-color: {getUserColour(qubit.user)}">{getUserName(qubit.user)}</span>
                </h3>
            {/if}
            <div class="qubit__qubit">
                <Qubit 
                    axes={axes[i]}
                    disabled={qubit.user !== 'you' || $isMeasuring}
                />
            </div>
            <div class="qubit__patchbay">    
                <Patchbay 
                    ids={axesIds.map(id => `${id}${i}`).reverse()} 
                    labels={axesNames.reverse()} 
                />
            </div>
            <div class="qubit__sliders">
                {#each get(axes[i]).reverse() as value, axis}
                    <Slider
                        disabled={qubit.user !== 'you' || $isMeasuring}
                        name={axesNames[2 - axis]}
                        colour={`var(--color-theme-${3 - axis})`}
                        value={value}
                        on:change={e => handleSliderChange(e,i,axis)}
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
        overflow-y: scroll;
        display: flex;
        flex-wrap: wrap;
        @media (max-width: 1200px) {
            padding: 1rem 1rem 0;
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

        &--full-height {
            height: 100%;
            max-height: 37rem;
        }

        &--single {
            flex-basis: 100%;
            margin-bottom: 1rem;
            &:nth-last-of-type(1) {
                margin-bottom: 0;
            }
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
            height: calc(400px - 1rem);
            margin-right: 1rem;
            margin-bottom: 1rem;
            &:nth-child(3n) {
                margin-right: 0rem;
            }
        }

        &--border {
            border: 2px solid;
        }

        &__info {
            position: absolute;
            top: 1.5rem;
            left: 2rem;
            z-index: 10;
            & span {
                text-align: center;
                padding: 0.5rem 1rem;
                background-color: var(--color-grey-darker);
                border-radius: 20px;
                margin-right: 0.5rem;
                font-weight: bold;
                color: var(--color-grey-darker);
            }
        }

        &__qubit {
            grid-row: 1;
            grid-column: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }   

        &__patchbay {
            display: none;
            align-items: flex-end;
            grid-row: 1;
            grid-column: 1;
            padding-bottom: 1rem;

            @media (min-width: 1200px) {
                display: flex;
            }
            
        }

        &__sliders {
            display: flex;
            flex-direction: row-reverse;
            margin: 0 0 0 auto;
            padding: 1rem 1rem 2rem;
            height: 100%;
            grid-row: 1 / 3;
            grid-column: 1;

        }
    }
</style>