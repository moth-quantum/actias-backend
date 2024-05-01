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

<style lang="scss">
    button {
        position: relative;
        outline: 1px dotted var(--color-theme-3);
    }
</style>