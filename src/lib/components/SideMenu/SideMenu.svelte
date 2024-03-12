<script lang="ts">
    import { Drawer } from 'flowbite-svelte';
    import { sineIn } from 'svelte/easing';
    import Button from '$lib/components/Button/Button.svelte';
    import { library } from '@fortawesome/fontawesome-svg-core';
    import { faGlobe, faUser, faHeadphones, faCircleQuestion, faGear } from '@fortawesome/free-solid-svg-icons';
    library.add(faGlobe, faUser, faHeadphones, faCircleQuestion, faGear);

    const items = [
        { text: 'Profile', icon: faUser, onClick: () => (console.log('hello'))},
        { text: 'Assign Qubits', icon: faGlobe, onClick: () => (console.log('hello'))},
        { text: 'Audio Routing', icon: faHeadphones, onClick: () => (console.log('hello'))},
        { text: 'Control panel', icon: faGear, onClick: () => (console.log('hello'))},
        { text: 'Tooltips', icon: faCircleQuestion, onClick: () => (console.log('hello'))}
    ];

    let sidebarIsHidden = false; 
    let transitionParams = {
        x: -320,
        duration: 200,
        easing: sineIn
    };
</script>

<aside>
    {#each items as item}
        <Button 
            text={item.text} 
            colour="dark" 
            orientation="vertical"
            onClick={item.onClick} 
            icon={item.icon} 
        />
    {/each}
</aside>

<Drawer 
    transitionType="fly" {transitionParams} 
    bind:hidden={sidebarIsHidden} 
    id="side-menu"
>
    <div class="sidebar">
        <h1>hello</h1>
    </div>
</Drawer>

<style>
    aside {
        background-color: var(--color-grey-darkest);
        padding: 5rem 0 1rem;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;

        & > * {
            /* max-height: 5rem; */
            margin-bottom: 2rem;
        }
    }

    .sidebar {
        background-color: blue;
    }
</style>