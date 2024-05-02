<script lang="ts">
    import { learn, learnControl } from '$lib/stores/midi';
    export let id: string = '';
    const handleClick = (e: Event) => {
        e.preventDefault();
        learnControl.set(id)
    };
</script>

{#if $learn}
    <button on:click={handleClick}>
        <slot />
    </button>
{:else}
    <slot />
{/if}

<style lang="scss">
    button {
        position: relative;
        outline: 1px dotted var(--color-theme-3);
        letter-spacing: 0.1rem;
        text-align: inherit;
    }
</style>