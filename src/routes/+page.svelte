<script lang="ts">
    import { onMount } from 'svelte';
    import { startAudio } from '../sound';
    import { showSideMenu, isApp } from '$lib/stores/global';
    import { performanceMode } from '$lib/stores/sideMenu';
    import { controlsAreVisible, hideControls, showControls, toggleControls } from '$lib/stores/sideMenu';
    import { redrawCables } from '$lib/stores/patching';
    import Presets from '$lib/components/Presets/Presets.svelte';
    import Parameters from '$lib/components/Parameters/Parameters.svelte';
    // @ts-ignore
    import Controls from '$lib/components/Controls/Controls.svelte';
    import Button from '$lib/components/Button/Button.svelte';
    import Measure from '$lib/components/Measure/Measure.svelte';
    import Qubits from '$lib/components/Qubits/Qubits.svelte';
    import InstrumentButtons from '$lib/components/InstrumentButtons/index.svelte';
    import Toasts from '$lib/components/Toasts/Toasts.svelte';
    import { presetKeys, savePreset, deletePreset, editPreset, activePreset } from '$lib/stores/presets-project';
    import { isChrome } from '$lib/utils/utils';
    import { draggable } from '@neodrag/svelte';
    import { Drawer } from 'flowbite-svelte';
    import { sineIn } from 'svelte/easing';

    import { faBars } from '@fortawesome/free-solid-svg-icons';
    
    import { login, logout } from '$lib/networking/login';
    import { getUsers } from '$lib/networking/users';
    import { broadcast } from '$lib/networking/broadcast';
    import { listen } from '$lib/networking/listen';
    import { updateProfile } from '$lib/networking/profile';

    import { addToast } from '$lib/stores/toasts';

    import initElectronAPI from '$lib/electronAPI';

    let isDesktop = false;
    let sidebarIsHidden = true; 
    let transitionParams = {
        x: -320,
        duration: 200,
        easing: sineIn
    };
    let position = {x: 0, y: 0};
    
    const handleResize = () => {
        isDesktop = window.innerWidth > 1200
        isDesktop 
            ? hideControls() 
            : showControls()
        sidebarIsHidden = true
    }

    onMount(async () => {
        isChrome() || addToast('Please use Chrome for optimum audio performance', 'warning');
        isDesktop = window.innerWidth > 1200
        redrawCables(500)

        const handleKeyDown = (event: KeyboardEvent) => {
            event.key === 'k' && toggleControls();
        };

        window.addEventListener('keydown', handleKeyDown);

        const unsubscribePerformanceMode = performanceMode.subscribe(isVisible => {
            isVisible && addToast('Press escape to exit performance mode', 'info')
        })

        // exit at this point if not in electron
        if(!isApp()) return () => {
            window.removeEventListener('keydown', handleKeyDown)
            unsubscribePerformanceMode()
        };
        
        initElectronAPI()
        
        await login()
        const unsubscribeUpdateProfile = updateProfile()
        await getUsers()
        const unsubscribeBroadcast = broadcast()
        const unsubscribeListen = listen()

        window.addEventListener("beforeunload", logout);

        return () => {
            unsubscribeBroadcast()
            unsubscribeListen()
            unsubscribeUpdateProfile()
            unsubscribePerformanceMode()
            window.removeEventListener("beforeunload", logout);
            window.removeEventListener('keydown', handleKeyDown);
        }
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
        <Parameters />
    </div>
</Drawer>

<Toasts />

<section 
    class="buttons container mx-auto"
    class:hidden={$performanceMode}
>
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
            type="project"
            keys={$presetKeys}
            savePreset={savePreset}
            deletePreset={deletePreset}
            editPreset={editPreset}
            active={activePreset}
        />
    </div>
</section>

<section 
    class="container synth"
    class:synth--performance-mode={$performanceMode}
>
    
    <div 
        class="parameters"
        class:hidden={$performanceMode}
    >
        <Parameters />
    </div>

    <div class="qubits">
        <Qubits />
    </div>

    {#if $controlsAreVisible && !$performanceMode}
        <div class="controls" use:draggable={{
            position, 
            handle: '.controls__handle',
            disabled: !isDesktop
        }}>
            <div class="controls__handle"></div>
            <div class="keyboard">
                <Controls />
            </div>
    
            <div class="measure">
                <Measure />
            </div>
        </div>
    {/if}

</section>

<style lang="scss">
    .sidebar {
        z-index: 2000;
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
            padding: 0 2rem;
            grid-gap: 1rem;
            grid-template-columns: 3fr 9fr;
            grid-template-rows: 1fr 1fr 0.5fr;

            &--performance-mode {
                display: flex;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                padding: 0;
            }
        }
    }

    .parameters {
        display: none;
        flex-direction: column;
        grid-column-start: 1;
        grid-column-end: 1;
        grid-row-start: 1;
        grid-row-end: 4;
        padding-bottom: 1.5rem;
        
        @media (min-width: 1200px) {
            min-height: 76vh;
            display: flex;
        }
    }
    
    .qubits {
        grid-column-start: 2;
        grid-column-end: 2;
        grid-row-start: 1;
        grid-row-end: 4;
        display: flex;
        align-items: flex-start;
        overflow: scroll;
        margin-bottom: 1rem;
        
        @media (min-width: 1200px) {
            height: 100%;
            margin-bottom: 0;
        }

    }

    .controls {
        width: 100%;
        max-width: 100vw;
        background-color: var(--color-grey-mid);
        padding: 1rem;
        border-top: 0.5px solid var(--color-grey-light);
        position: relative;
        
        &__handle {
            position:absolute;
            top: 0;
            left: 0;
            height: 1rem;
            width: 100%;
            background-color: transparent;
            cursor: move;
        }
        
        @media (min-width: 800px) {
            max-width: 75rem;
        }

        @media (min-width: 1000px) {            
            border: 0.5px solid var(--color-grey-light);
            border-radius: 10px 0 0 0;
            display: flex;
        }
        
        @media (min-width: 1200px) {
            z-index: 1000;
            position: fixed;
            bottom: 0;
            right: 0;
        }
    }

    .keyboard {
        background-color: var(--color-grey-dark);
        @media (min-width: 1000px) {
            width: 75%;
            margin-right: 1rem;
        }
    }
    .measure {
        @media (min-width: 1000px) {
            width: 25%;
        }
    }
</style>
