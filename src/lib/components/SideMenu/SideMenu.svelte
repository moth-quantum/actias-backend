<script lang="ts">
    import Button from '$lib/components/Button/Button.svelte';
    import Profile from './PanelProfile.svelte';
    import Connect from './PanelConnect.svelte';
    import Qubits from './PanelQubits.svelte';
    import Routing from './PanelRouting.svelte';
    import Midi from './PanelMidi.svelte';

    import { library } from '@fortawesome/fontawesome-svg-core';
    import { faGlobe, faUser, faUsers, faCircle, faHeadphones, faCircleQuestion, faGear } from '@fortawesome/free-solid-svg-icons';
    library.add(faGlobe, faUser, faUsers, faCircle, faHeadphones, faCircleQuestion, faGear);

    let showMenuPanel = false; 
    let activePanel: string | null = null;

    const showPanel = (panel: string) => {
        if(activePanel === panel) {
            activePanel = null
            showMenuPanel = false
        } else {
            activePanel = panel
            showMenuPanel = true
        }
    }

    const items = [
        { text: 'Profile', icon: faUser, onClick: () => showPanel('profile')},
        { text: 'Assign Qubits', icon: faGlobe, onClick: () => showPanel('qubits')},
        { text: 'Connect', icon: faUsers, onClick: () => showPanel('connect')},
        { text: 'Audio', icon: faHeadphones, onClick: () => showPanel('routing')},
        { text: 'MIDI', icon: faCircle, onClick: () => showPanel('midi')},
        { text: 'Control', icon: faGear, onClick: () => {
            showMenuPanel = false
        }},
        { text: 'Tooltips', icon: faCircleQuestion, onClick: () => {
            showMenuPanel = false
        }}
    ];

    
</script>

<aside class="side-menu">
    <div class="side-menu__buttons">
        {#each items as item}
            <Button 
                text={item.text} 
                colour="dark" 
                orientation="vertical"
                onClick={item.onClick} 
                icon={item.icon} 
                classes="mb-8"
            />
        {/each}
    </div>
    {#if showMenuPanel}
        <div class="side-menu__panel">
            {#if activePanel === 'profile'}
                <Profile />
            {/if}

            {#if activePanel === 'connect'}
                <Connect />
            {/if}

            {#if activePanel === 'qubits'}
                <Qubits />
            {/if}
            {#if activePanel === 'routing'}
                <Routing />
            {/if}
            {#if activePanel === 'midi'}
                <Midi />
            {/if}
        </div>
    {/if}
    
</aside>

<style lang="scss">
    .side-menu {
        background-color: var(--color-grey-darkest);
        padding: 4rem 0 1rem;
        position: relative;
        border-top: 1px solid var(--color-grey-dark);

        &__buttons {
            padding: 1rem 0;
            width: 6rem;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
        }

        &__panel {
            background-color: var(--color-grey-darkest);
            min-width: 30rem;
            height: 100%;
            z-index: 101;
            position: absolute;
            top: 0;
            left: 6rem;
            border-left: 1px solid var(--color-grey-dark);
            color: white;
            padding: 1rem 2rem;
        }
    }
</style>