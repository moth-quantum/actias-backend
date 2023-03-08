<script>
    import "../app.postcss";
    import Header from "./Header.svelte";
    import "./styles.css";
</script>

<div class="app">
    <Header />

    <main class="w-full px-2">
        <slot />
    </main>
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
</style>
