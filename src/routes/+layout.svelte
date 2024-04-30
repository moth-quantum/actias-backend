<script>
    import { showSideMenu } from "$lib/stores/global";
    import { menuItems } from "$lib/stores/sideMenu";
    import "../app.postcss";
    import Header from "./Header.svelte";
    import Toast from "$lib/components/Toasts/Toast.svelte";
    import QubitsPerform from "$lib/components/Qubits/QubitsPerform.svelte";
    import "./styles.css";
    import "./fonts.css";
    import SideMenu from '$lib/components/SideMenu/SideMenu.svelte';

    import { onMount } from 'svelte';
    import Qubit from "$lib/components/Qubits/Qubit.svelte";
    
    let performanceModeActive = false;

    onMount(async () => {
        const unsubscribeMenuItems = menuItems.subscribe(items => {
            let performanceMode = items.find(item => item.name === 'perform');
            performanceModeActive = performanceMode?.isActive || false;
        });

        function handleKeydown(e) {
            if (e.key === 'Escape' && performanceModeActive) {
                performanceModeActive = false;
                menuItems.update(items => items.map(item => {
                    if (item.name === 'perform') {
                        item.isActive = false;
                    }
                    return item;
                }));
            }
        }

        window.addEventListener('keydown', handleKeydown);

        return () => {
            unsubscribeMenuItems();
            window.removeEventListener('keydown', handleKeydown);
        };
    })
</script>

{#if performanceModeActive}
    <div class="app fullscreen">
        <div class="toast-container">
            <Toast message="Press the Esc key to exit fullscreen" type='info' /> 
        </div>
        <QubitsPerform />
    </div>
{:else}
    <div class="app">
        <Header />
        
        <main class="main container">
            {#if $showSideMenu}
                <SideMenu />
            {/if}
            <div class="main__content">
                <slot />
            </div>
        </main>

        <footer class="footer container">
            <span>Build <a href="https://cephasteom.co.uk">Cephas Teom</a> | Design James Cameron</span>
            <br>
            <span>Quantum integration using <a href="https://doi.org/10.5281/zenodo.6342382">SOC-QASM</a></span>
            <br>
            <span>© <a href="https://mothquantum.com/">Moth Quantum</a> / <a href="https://cmr.soc.plymouth.ac.uk/">ICCMR</a> 2023</span>
        </footer>
    </div>
{/if}

<svelte:window on:resize={() => window.innerWidth < 1200 && showSideMenu.set(false)} />

<style lang="scss">
    .app {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    .main {
        display: flex;
        margin: 0 auto;

        &__content {
            flex: 1;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            background-color: var(--color-grey-mid);
        }
    }

    footer {
        width: 100%;
        padding: 1rem;
        margin: 0 auto;
        color: var(--color-grey-light);
        text-align: center;
        z-index: 100;
        background-color: var(--color-grey-darker);
        @media (min-width: 1200px) {
            text-align: right;
            padding: 1rem 2rem;
        }

        @media (min-width: calc(var(--max-width))) {
            padding: 1rem 0;
        }

        span {
            font-size: var(--text-sm);
        }
    }

    .fullscreen {
        width: 100vw;
        height: 100vh;
        padding: 2rem;
        position: relative;
    }

    .toast-container {
        position: fixed;
        top: 0;
        right: 0;
        z-index: 100;
        padding: 1rem;
    }

</style>
