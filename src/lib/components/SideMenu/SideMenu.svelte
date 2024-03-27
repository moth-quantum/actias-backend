<script lang="ts">
    import { onMount } from 'svelte';
    import Button from '$lib/components/Button/Button.svelte';
    import Profile from './PanelProfile.svelte';
    import Connect from './PanelConnect.svelte';
    import Qubits from './PanelQubits.svelte';
    import Midi from './PanelMidi.svelte';
    import { menuItems, activeSubMenu } from '$lib/stores/sideMenu';
    import { toggleKeyboard } from '$lib/stores/global';
  import Panel from './Panel.svelte';

    const handleMenuClick = (name: string) => {
        menuItems.update(items => items.map(item => {
            if(item.name === name) {
                item.isActive = !item.isActive
            } else if(item.hasSubMenu) {
                item.isActive = false
            }
            return item
        }))

        name === 'keyboard' && toggleKeyboard() 
    }

    const closeMenu = () => {
        menuItems.update(items => items.map(item => {
            item.isActive = false
            return item
        }))
    }

    onMount(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeMenu();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    });
    
</script>

<svelte:window on:resize={() => closeMenu()} />

<aside class="side-menu">
    <div class="side-menu__buttons">
        {#each $menuItems as item}
            {#if item.isVisible}
            <div class="side-menu__item {item.isActive ? 'side-menu__item--active' : ''}">
                <Button 
                    text={item.name} 
                    colour="dark" 
                    orientation="vertical"
                    onClick={() => handleMenuClick(item.name)} 
                    icon={item.icon} 
                    image={item.image}
                />
            </div>
            {/if}
        {/each}
    </div>
    {#if $activeSubMenu}
        <div class="side-menu__panel">
            {#if ['profile', 'connect', 'assign', 'midi'].includes($activeSubMenu)}
                <Panel 
                    title={$activeSubMenu} 
                    on:close={closeMenu}
                >
                    {#if $activeSubMenu === 'profile'}
                        <Profile />
                    {/if}

                    {#if $activeSubMenu === 'connect'}
                        <Connect />
                    {/if}

                    {#if $activeSubMenu === 'assign'}
                        <Qubits />
                    {/if}
                    {#if $activeSubMenu === 'midi'}
                        <Midi />
                    {/if}
                </Panel>
            {/if}
        </div>
    {/if}
    
</aside>

<style lang="scss">
    .side-menu {
        flex-basis: min-content;
        background-color: var(--color-grey-darkest);
        padding: 4rem 0 1rem;
        position: relative;
        border-top: 1px solid var(--color-grey-dark);

        &__buttons {
            padding: 1rem 0;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
        }

        &__item {
            display: flex;
            justify-content: center;
            margin-bottom: 2rem;
            width: 100%;
            min-width: 6.2rem;
            &--active {
                margin-right: -2px;
                border-right: 2px solid var(--color-theme-1);
            }
        }

        &__panel {
            background-color: var(--color-grey-darkest);
            min-width: 25rem;
            height: 100%;
            z-index: 101;
            position: absolute;
            top: 0;
            left: 6.2rem;
            border-left: 1px solid var(--color-grey-dark);
            color: white;
            padding: 1rem 2rem;
            overflow-y: scroll;
        }
    }
</style>