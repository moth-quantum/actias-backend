<script lang="ts">
    import { onMount } from 'svelte';
    import { startAudio } from '../sound';
    import { fullscreen as fs, showKeyboard, showSideMenu } from '$lib/stores/global';
    import { redrawCables } from '$lib/stores/patching';
    import { activeQubitCount } from '$lib/stores/qubits';
    import Presets from '$lib/components/Presets/Presets.svelte';
    import Parameters from '$lib/components/Parameters/Parameters.svelte';
    // @ts-ignore
    import Controls from '$lib/components/Controls/Controls.svelte';
    import Button from '$lib/components/Button/Button.svelte';
    import Measure from '$lib/components/Measure/Measure.svelte';
    import Qubits from '$lib/components/Qubits/Qubits.svelte';
    import InstrumentButtons from '$lib/components/InstrumentButtons/index.svelte';
    import Toasts from '$lib/components/Toasts/Toasts.svelte';
    import { presetKeys, savePreset, deletePreset, editPreset, activePreset } from '$lib/stores/presets-synths';

    import { Drawer } from 'flowbite-svelte';
    import { sineIn } from 'svelte/easing';

    import { library } from '@fortawesome/fontawesome-svg-core';
    import { faBars } from '@fortawesome/free-solid-svg-icons';
    
    import { login } from '$lib/networking/login';
    import { getUsers } from '$lib/networking/users';
    import { broadcast } from '$lib/networking/broadcast';
    import { listen } from '$lib/networking/listen';
    
    library.add(faBars);

    let isDesktop = false;
    let sidebarIsHidden = true; 
    let transitionParams = {
        x: -320,
        duration: 200,
        easing: sineIn
    };

    const handleResize = () => {
        isDesktop = window.innerWidth > 1200
        sidebarIsHidden = true
    }

    onMount(() => {
        isDesktop = window.innerWidth > 1200
        redrawCables(500)
        
        // TODO: conditional functionality if isApp()
        login()
        getUsers()
        // const unsubscribeBroadcast = broadcast()
        // const unsubscribeListen = listen()

        // return () => {
        //     unsubscribeBroadcast()
        //     unsubscribeListen()
        // }
    });

</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="TODO: please write a description" />
</svelte:head>

<svelte:window 
    on:click={startAudio} 
    on:touchstart={startAudio}
    on:keydown={startAudio}
    on:resize={handleResize}
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
    <div class="buttons__inner">
        <div class="buttons__instruments">
            <Button 
                colour="grey"
                border={true}
                active={$showSideMenu}
                narrow={true}
                onClick={() => showSideMenu.update(v => !v)}
                icon={faBars}
                classes="mr-2"
            />
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
    
        <Presets 
            type="instrument"
            keys={$presetKeys}
            savePreset={savePreset}
            deletePreset={deletePreset}
            editPreset={editPreset}
            active={activePreset}
        />
    </div>
</section>

<section class={`container synth ${ $fs ? 'synth--fullscreen' : ''}`}>
    
    <div class="parameters">
        <Parameters />
    </div>

    <div class="interface">
        <div 
            class="qubits"
            class:qubits--full={$activeQubitCount < 3}
            style="max-height: {$showKeyboard ? '34rem' : 'none'};"
        >
            <Qubits />
        </div>
    
        {#if $showKeyboard}
            <div class="controls">
                <div class="keyboard">
                    <Controls />
                </div>
        
                <div class="measure">
                    <Measure />
                </div>
            </div>
        {/if}
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
        @media (min-width: 1200px) {
            padding-bottom: 1.5rem;
        }
        background-color: var(--color-grey-mid);
        &__inner {
            padding: 1rem;
            box-shadow: 0 0.5rem 0.5rem 0.25rem var(--color-box-shadow);
            display: flex;
            justify-content: space-between;
            @media (min-width: 1200px) {
                padding: 1rem 2rem;
            }

        }
        @media (min-width: 1200px) {
            z-index: 100;
        }
        

        &__instruments {
            display: none;
            @media (min-width: 1200px) {
                display: flex;
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
            padding: 0 2rem 1.5rem;
            grid-gap: 1rem;
            grid-template-columns: 3fr 9fr;
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

    .interface {
        grid-column-start: 2;
        grid-column-end: 2;
        grid-row-start: 1;
        grid-row-end: 4;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .qubits {
        display: flex;
        align-items: flex-start;
        overflow: scroll;
        margin-bottom: 1rem;

        @media (min-width: 1200px) {
            margin-bottom: 0;
        }

        &--full {
            height: 100%;
        }

    }

    .controls {
        width: 100%;
        z-index: 100;
        background-color: var(--color-grey-mid);

        @media (min-width: 1200px) {
            width: calc(100% - 1.5rem);
            padding: 1rem 0 0 1rem;
            margin-left: 1.5rem;
        }

        @media (min-width: 1450px) {
            display: flex;
        }
    }

    .keyboard {
        background-color: var(--color-grey-dark);
        @media (min-width: 1450px) {
            width: 75%;
            margin-right: 1rem;
        }
    }
</style>
