<script lang="ts">
    import { learn, learnControl } from '$lib/stores/midi';
    export let id: string = '';
    export let classes: string = '';
    const handleClick = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        learnControl.set(id)
    };
</script>

{#if $learn}
    <button 
        on:click={handleClick}
        class={classes}
    >
        <div class="overlay"/>
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

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>