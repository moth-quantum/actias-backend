<script lang="ts">
    import { learn, learnControl } from '$lib/stores/midi';
    export let id: string = '';
</script>

{#if $learn}
    <button on:click={() => learnControl.set(id)}>
        <slot />
    </button>
{:else}
    <slot />
{/if}

<style>
    /* Add your component styles here */
</style>