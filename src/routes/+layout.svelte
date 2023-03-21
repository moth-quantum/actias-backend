<script>
    import "../app.postcss";
    import Header from "./Header.svelte";
    import "./styles.css";
    import "./fonts.css";
</script>

<div class="app">
    <Header />

    <main class="w-full container">
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
        background-color: var(--color-grey-mid);
    }

    footer {
        width: 100%;
        text-align: right;
        padding-top: 1rem;
        padding-bottom: 1rem;
    }

</style>
