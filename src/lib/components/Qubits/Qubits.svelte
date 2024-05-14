<script lang="ts">
    import { qubits, axes, activeQubitCount, isMeasuring } from '$lib/stores/qubits';
    // @ts-ignore
    import { axesValues, focusedQubit } from '$lib/stores/qubits';
    import { redrawCables } from '$lib/stores/patching';
    import Qubit from './Qubit.svelte';
    import Patchbay from '$lib/components/Patching/Patchbay.svelte';
    import Slider from '$lib/components/Sliders/Slider.svelte';
    import { debounce } from '$lib/utils/utils';
    import { getUserColour, getUserName } from '$lib/stores/users';
    import { isApp, performanceMode } from '$lib/stores/global';
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';
    
    let axesIds = ['z', 'y', 'x'];
    let axesNames = ['θ', 'φ', 'λ'];
    let windowWidth: number;

    const handleScroll = debounce(() => redrawCables(), 1);

    const handleSliderChange = (e: CustomEvent, qubit: number, axis: number) => {
        axes[qubit].update(axes => {
            axes[axis] = e.detail;
            return axes;
        });
    }

    $: isSingle = !$performanceMode && $activeQubitCount === 1 || windowWidth < 1000;
    $: isDouble = !$performanceMode && ($activeQubitCount%2 === 0 || $activeQubitCount === 3 || windowWidth < 1500) && !isSingle;
    $: isTriple = !$performanceMode && !isSingle && !isDouble;
    $: isFullHeight = !$performanceMode && ($activeQubitCount === 1 && windowWidth > 1000) 
        || ($activeQubitCount === 2 && windowWidth > 1000);

    $: pModeWidth = $activeQubitCount <= 4 ? `flex-basis: calc(${100/$activeQubitCount}% - 2rem);` :
                   $activeQubitCount <= 6 ? `flex-basis: calc(${100/3}% - 2rem);` :
                   $activeQubitCount <= 8 ? `flex-basis: calc(${100/4}% - 2rem);` :
                   $activeQubitCount === 9 ? `flex-basis: calc(${100/3}% - 2rem);` :
                   `flex-basis: calc(${100/4}% - 2rem);`
                   ;
    $: pModeHeight = `height: calc(${$activeQubitCount <= 4 ? '100%' 
        : $activeQubitCount <= 8 ? '50%'
        : '33.3333%'} - 2rem);`
    
    onMount(() => {
        windowWidth = window.innerWidth;

        const handleKeyDown = (event: KeyboardEvent) => {
            event.key === 'Escape' && performanceMode.set(false)
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    });

</script>

<svelte:window on:resize={() => windowWidth = window.innerWidth} />

<div 
    class="qubits"
    class:qubits--performance={$performanceMode}
    on:scroll={() => handleScroll()}
>
    {#each axes as store, i}
        {#if $qubits[i].active}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div 
                class="qubit"
                class:qubit--single={isSingle}
                class:qubit--double={isDouble}
                class:qubit--triple={isTriple}
                class:qubit--full-height={isFullHeight}
                class:qubit--border={
                    $activeQubitCount > 1 &&
                    (!$performanceMode && $focusedQubit === i || $qubits[i].user !== 'you')
                }
                style="border-color: {$focusedQubit === i && !$performanceMode 
                    ? 'var(--color-yellow)' 
                    : getUserColour($qubits[i].user)
                }; {$performanceMode ? pModeWidth + pModeHeight : ''};"
                on:click={() => focusedQubit.set(i)}
            >
                {#if isApp()}
                    <h3 class="qubit__info">
                        <span style="background-color: {getUserColour($qubits[i].user)}">{(i + 1).toString().padStart(2, '0')}</span>
                        <span style="background-color: {getUserColour($qubits[i].user)}">{getUserName($qubits[i].user)}</span>
                    </h3>
                {/if}
                <div class="qubit__qubit">
                    <Qubit 
                        {i}
                        axes={store}
                        disabled={$qubits[i].user !== 'you' || $isMeasuring}
                    />
                </div>
                {#if !$performanceMode}
                    <div class="qubit__patchbay">    
                        <Patchbay 
                            ids={axesIds.map(id => `${id}${i}`)} 
                            labels={axesNames} 
                        />
                    </div>
                    <div class="qubit__sliders">
                        {#each get(store) as value, axis}
                            <Slider
                                id={`qubit-${i}-${axis}`}
                                name={axesNames[2 - axis]}
                                disabled={$qubits[i].user !== 'you' || $isMeasuring}
                                colour={`var(--color-theme-${3 - axis})`}
                                value={$axesValues[i][axis]}
                                on:change={e => {
                                    handleSliderChange(e,i,axis)
                                    focusedQubit.set(i)
                                }}
                            />
                        {/each}
                    </div>
                {/if}

            </div>
        {/if}
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

        &--performance {
            padding: 1rem;
            width: 100vw;
            & .qubit {
                // width: 100%;
                // height: calc(50% - 2rem);
                // flex-basis: calc(50% - 2rem);
                margin: 1rem!important;
            }
        }
    }

    .qubit {
        position: relative;
        box-sizing: border-box;
        background-color: var(--color-grey-dark);
        display: grid;
        cursor: pointer;
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