<script>
    import { showSideMenu, performanceMode } from "$lib/stores/global";
    import "../app.postcss";
    import Header from "./Header.svelte";
    import "./styles.css";
    import "./fonts.css";
    import SideMenu from '$lib/components/SideMenu/SideMenu.svelte';
</script>

<div class="app">
    <Header />
    
    <main class="main container">
        {#if $showSideMenu && !$performanceMode}
            <SideMenu />
        {/if}
        <div class="main__content">
            <slot />
        </div>
    </main>

    <footer 
        class="footer container"
        class:hidden={$performanceMode}
    >
        <span>Build | <a href="https://cephasteom.co.uk">Cephas Teom</a> / <a href="https://lunar.build">Lunar</a></span>
        <br>
        <span>Design | James Cameron / <a href="https://lunar.build">Lunar</a></span>
        <br>
        <span>© <a href="https://mothquantum.com/">Moth Quantum</a> {new Date().getFullYear()}</span>
    </footer>
</div>

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

</style>
