<script>
    import Toast from "./Toast.svelte";
    import { toasts } from '$lib/stores/toasts';

</script>

<div class="toasts">
    {#each $toasts as {message, type}}
        <Toast {message} {type} /> 
    {/each}
</div>

<style lang='scss'>
    .toasts {
        position: fixed;
        top: 0;
        right: 0;
        z-index: 1000;
        padding: 1rem;
    }
</style>