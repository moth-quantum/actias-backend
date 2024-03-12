<script lang="ts">
    import Button from '$lib/components/Button/Button.svelte';
    import Input from '$lib/components/Forms/Input.svelte';
    import { username, id, location } from '$lib/stores/user';

    import { library } from '@fortawesome/fontawesome-svg-core';
    import { faGlobe, faUser, faHeadphones, faCircleQuestion, faGear } from '@fortawesome/free-solid-svg-icons';
    library.add(faGlobe, faUser, faHeadphones, faCircleQuestion, faGear);

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
        { text: 'Audio Routing', icon: faHeadphones, onClick: () => showPanel('routing')},
        { text: 'Control panel', icon: faGear, onClick: () => {
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
                <h2>Your Profile</h2>
                <div class="side-menu__input">
                    <Input id="id" label="ID" bind:value={$id} />
                </div>
                <div class="side-menu__input">
                    <Input id="username" label="Username" bind:value={$username} />
                </div>
                <div class="side-menu__input">
                    <Input id="location" label="Location" bind:value={$location}/>
                </div>
                
            {/if}
            {#if activePanel === 'qubits'}
                <h2>Qubits</h2>
            {/if}
            {#if activePanel === 'routing'}
                <h2>Routing</h2>
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

        &__input {
            display: flex;
            flex-direction: column;
            margin-bottom: 2rem;
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
            display: flex;
            flex-direction: column;

            & h2 {
                text-align: center;
                font-size: var(--text-sm);
                padding: 4px 0 calc(2rem + 4px);
            }
        }
    }
</style>