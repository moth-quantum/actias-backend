<script>
    import "../app.postcss";
    import Header from "./Header.svelte";
    import "./styles.css";
    import "./fonts.css";
    import { isApp } from "$lib/stores/global";
    import SideMenu from '$lib/components/SideMenu/SideMenu.svelte';
</script>

<div class="app">
    <Header />
    
    <main class="main container">
        <!-- {#if isApp()} -->
        {#if true}
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
