<script>
    import Toast from "./Toast.svelte";
    import { toasts } from '$lib/stores/toasts';

</script>

<div class="toasts">
    {#each $toasts as {message}}
        <Toast {message} /> 
    {/each}
</div>

<style lang='scss'>
    .toasts {
        position: fixed;
        top: 0;
        right: 0;
        z-index: 100;
        padding: 1rem;
    }
</style>