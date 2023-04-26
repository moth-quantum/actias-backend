<script>
    import { onMount } from 'svelte';
    import { startAudio, output } from '../sound';
    import { axes } from '$lib/stores/qubit';
    import Patchbay from '$lib/components/Patching/Patchbay.svelte';
    import Presets from '$lib/components/Presets/Presets.svelte';
    import Parameters from '$lib/components/Parameters/Parameters.svelte';
    import Controls from '$lib/components/Controls/Controls.svelte';
    import Button from '$lib/components/Button/Button.svelte';
    import Measure from '$lib/components/Measure/Measure.svelte';
    import Slider from '$lib/components/Sliders/Slider.svelte';
    import Qubit from '$lib/components/Qubit/Qubit.svelte';
    import Meter from '$lib/components/Meter/Meter.svelte';
    import DataStream from '$lib/components/DataStream/Datastream.svelte';
    import InstrumentButtons from '$lib/components/InstrumentButtons/index.svelte';

    import { Drawer } from 'flowbite-svelte';
    import { sineIn } from 'svelte/easing';

    let axesIds = $axes.map(({key}) => key);
    let axesNames = $axes.map(({name}) => name);
    let isDesktop = false;
    let qubitH = 0;
    let sidebarIsHidden = true; 
    let transitionParams = {
        x: -320,
        duration: 200,
        easing: sineIn
    };

    onMount(() => isDesktop = window.innerWidth > 1200);

</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="TODO: please write a description" />
</svelte:head>

<svelte:window 
    on:click={startAudio} 
    on:touchstart={startAudio}
    on:keydown={startAudio}
    on:resize={() => isDesktop = window.innerWidth > 1200}
/>

<Drawer 
    transitionType="fly" {transitionParams} 
    bind:hidden={sidebarIsHidden} 
    id='sidebar'
>
    <div class="sidebar">
        <svg on:click={() => (sidebarIsHidden = true)} class="sidebar__close w-5 h-5 mb-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
        <div class="sidebar__instruments">
            <InstrumentButtons orientation="vertical"/>
        </div>
        <Parameters showSockets={false}/>
    </div>
</Drawer>

<section class="buttons container mx-auto">
    <div class="buttons__instruments">
        <InstrumentButtons />
    </div>

    <div class="buttons__parameters">
        <Button 
            onClick={() => (sidebarIsHidden = false)} 
            active={!sidebarIsHidden} 
            colour="yellow" 
            text="Parameters" 
        />
    </div>

    <Presets />

</section>

<section class="synth container mx-auto">
    
    <div class="parameters">
        <Parameters />
    </div>

    <div class="qubit">
        <div class="qubit__inner">
            <div class="qubit__patchbay">
                <Patchbay 
                    title="axes"
                    ids={axesIds.reverse()} 
                    labels={axesNames.reverse()} 
                />
            </div>
            
            <div class="qubit__sphere" bind:clientHeight={qubitH}>
                <Qubit size={qubitH} />
            </div>

            <div class="qubit__sliders">
                <div>
                    {#each $axes as {value, name, colour} (name)}
                        <Slider 
                            orientation={isDesktop ? 'vertical' : 'horizontal'}
                            {name} {colour}
                            bind:value={value}
                        />
                    {/each}
                </div>
            </div>
        </div>
    </div>

    <div class="metrics">
        <Meter node={output}/>
        <div class="data-stream">
            <DataStream 
                data={$axes.map(({value}) => +(value * (Math.PI/2)).toFixed(2)).reverse()}
                labels={$axes.map(({name}) => name).reverse()}
            />
        </div>
    </div>

    <div class="controls">
        <Controls />
    </div>

    <div class="measure">
        <Measure />
    </div>

</section>

<style lang="scss">
    .sidebar {
        &__instruments {
            margin-bottom: 1rem;
        }
        &__close {
            cursor: pointer;
            fill: var(--color-grey-darkest)
        }
    }
    .buttons {
        padding: 1rem;
        background-color: var(--color-grey-mid);
        box-shadow: 0 0.5rem 0.5rem 0.25rem var(--color-box-shadow);
        display: flex;
        justify-content: space-between;
        
        @media (min-width: 1200px) {
            padding: 1rem 2rem;
        }

        &__instruments {
            display: none;
            @media (min-width: 1200px) {
                display: block
            }
        }

        &__parameters {
            display: block;
            @media (min-width: 1200px) {
                display: none
            }
        }

	}

    .synth {
        display: block;
        
        @media (min-width: 1200px) {
            display: grid;
            padding: 1.5rem 2rem;
            grid-gap: 1rem;
            grid-template-columns: 3fr 6fr 3fr;
            grid-template-rows: 1fr 1fr 0.5fr;
        }
    }

    .parameters {
        display: none;
        flex-direction: column;
        grid-column-start: 1;
        grid-column-end: 1;
        grid-row-start: 1;
        grid-row-end: 4;

        @media (min-width: 1200px) {
            display: flex;
        }
    }

    .qubit {
        grid-column-start: 1;
        grid-column-end: 1;
        grid-row-start: 1;
        grid-row-end: 1;

        display: flex;
        align-items: center;
        overflow: hidden;

        &--fullscreen {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 1000;

            .qubit__patchbay { display: none; }

            & ~ .metrics, & ~ .measure {
                z-index: 1001;
            }
        }

        @media (min-width: 1200px) {
            display: grid;
            grid-template-columns: 6fr 3fr;
            grid-gap: 1rem;
            
            grid-column-start: 2;
            grid-column-end: 4;
            grid-row-start: 1;
            grid-row-end: 3;
            
            width: 100%;
            border-radius: 10px;
        }
        
        background-color: var(--color-grey-dark);

        &__inner {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            padding: 1rem;

            @media (min-width: 1200px) {
                height: 100%;
                flex-direction: row;
                padding: 1rem 2rem;
            }
        }

        &__sphere {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 2rem;

            @media (min-width: 1200px) {
                width: 100%;
                position: absolute;
                top: 0%;
                left: 0%;
                bottom: 0;
                right: 0;
                margin-bottom: 0;
            }
        }

        &__patchbay {
            z-index: 10;
            display: none;
            @media (min-width: 1200px) {
                display: block;
            }
        }
        &__sliders {
            display: flex;
            grid-column-start: 5;
            grid-column-end: 7;
            grid-row-start: 1;
            grid-row-end: 3;
            z-index: 10;

            @media (min-width: 1200px) {
                margin: 0 -0.5rem 0 0;
            }

            & > div {
                width: 100%;
                margin: 0 auto;
                display: flex;
                flex-direction: column-reverse;
                
                @media (min-width: 600px) {
                    width: 80%;
                }
                @media (min-width: 1200px) {
                    flex-direction: row-reverse;
                    width: 100%;
                }
            }
        }
    }

    .metrics {
        display: none;
        grid-column-start: 3;
        grid-column-end: 3;
        grid-row-start: 1;
        grid-row-end: 3;
        padding: 1rem;
        
        @media (min-width: 1200px) {
            display: flex;
            flex-direction: column;
        }

        .data-stream {
            height: 100%;
            display: flex;
            padding: 2rem;
        }
        
    }

    .controls {
        grid-column-start: 1;
        grid-column-end: 1;
        grid-row-start: 2;
        grid-row-end: 2;

        @media (min-width: 1200px) {
            grid-column-start: 2;
            grid-column-end: 2;
            grid-row-start: 3;
            grid-row-end: 4;
            border-radius: 5px;
        }
        background-color: var(--color-grey-dark);
    }

    .measure {
        grid-column-start: 1;
        grid-column-end: 1;
        grid-row-start: 3;
        grid-row-end: 3;
        @media (min-width: 1200px) {
            grid-column-start: 3;
            grid-column-end: 3;
            grid-row-start: 3;
            grid-row-end: 4;   
        }
    }
</style>
