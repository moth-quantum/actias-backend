<script>
    import { onMount } from 'svelte';
    import { startAudio } from '../sound';
    import { fullscreen as fs, isApp, showKeyboard } from '$lib/stores/global';
    import Presets from '$lib/components/Presets/Presets.svelte';
    import Parameters from '$lib/components/Parameters/Parameters.svelte';
    // @ts-ignore
    import Controls from '$lib/components/Controls/Controls.svelte';
    import Button from '$lib/components/Button/Button.svelte';
    import Measure from '$lib/components/Measure/Measure.svelte';
    import Qubits from '$lib/components/Qubits/Qubits.svelte';
    import InstrumentButtons from '$lib/components/InstrumentButtons/index.svelte';
    import Toasts from '$lib/components/Toasts/Toasts.svelte';

    import { Drawer } from 'flowbite-svelte';
    import { sineIn } from 'svelte/easing';

    let isDesktop = false;
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
        <button on:click={() => (sidebarIsHidden = true)} >
            <svg class="sidebar__close w-5 h-5 mb-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
        </button>
        <div class="sidebar__instruments">
            <InstrumentButtons orientation="vertical"/>
        </div>
        <Parameters showSockets={false}/>
    </div>
</Drawer>

<Toasts />

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

    <Presets hidden={isApp()}/>
</section>

<section class={`container synth ${ $fs ? 'synth--fullscreen' : ''}`}>
    
    <div class="parameters">
        <Parameters />
    </div>

    <div class="qubits {$showKeyboard ? '' : 'qubits--full'}">
        <Qubits />
    </div>

    {#if $showKeyboard}
        <div class="controls">
            <Controls />
        </div>

        <div class="measure">
            <Measure />
        </div>
    {/if}

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
        z-index: 20;
        
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
        margin: 0 auto;
        
        @media (min-width: 1200px) {
            display: grid;
            padding: 1.5rem 2rem;
            grid-gap: 1rem;
            grid-template-columns: 3fr 6fr 3fr;
            grid-template-rows: 1fr 1fr 0.5fr;
        }

        &--fullscreen {
            position: fixed;
            z-index: 1000;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
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

    .qubits {
        grid-column-start: 1;
        grid-column-end: 1;
        grid-row-start: 1;
        grid-row-end: 1;
        max-height: 37rem;

        &--full {
            grid-column-start: 1;
            grid-column-end: 1;
            grid-row-start: 1;
            grid-row-end: 4;
            max-height: 45rem;
        }

        display: flex;
        align-items: flex-start;
        overflow: hidden;

        @media (min-width: 1200px) {
            
            grid-column-start: 2;
            grid-column-end: 4;
            grid-row-start: 1;
            grid-row-end: 3;
            
            width: 100%;
        } 

        &__fullscreen {
            position: absolute;
            top: 1rem;
            left: 2rem;
            @media (min-width: 1200px) {
                top: auto;
                bottom: 1rem;
            }
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
