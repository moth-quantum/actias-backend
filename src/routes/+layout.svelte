<script>
    import "../app.postcss";
    import Header from "./Header.svelte";
    import { Footer, FooterCopyright } from 'flowbite-svelte'
    import "./styles.css";
</script>

<div class="app">
    <Header />

    <main class="w-full px-2">
        <slot />
    </main>

    <footer class="footer container w-full m-auto">
        <span>Moth Quantum™ 2023</span>
    </footer>
        

</div>

<style>
    .app {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    main {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin: 0 auto;
        box-sizing: border-box;
    }

    footer {
        width: 100%;
        text-align: right;
        padding-top: 1rem;
        padding-bottom: 1rem;
    }

</style>
