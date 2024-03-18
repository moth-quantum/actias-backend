<script>
    import { createEventDispatcher } from 'svelte';

    export let value = 1;
    const dispatch = createEventDispatcher();

    function increment() {
        if (value < 127) {
            value++;
            dispatch('change', { value });
        }
    }

    function decrement() {
        if (value > 1) {
            value--;
            dispatch('change', { value });
        }
    }
</script>

<div>
    <button on:click={decrement} disabled={value === 1}>&lt;</button>
    <span>{value}</span>
    <button on:click={increment} disabled={value === 127}>&gt;</button>
</div>

<style lang="scss">
    div {
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    button {
        color: white;
        border: none;
        padding: 0.5rem;
        font-size: var(--text-sm);
        cursor: pointer;
    }

    span {
        color: white;
        font-size: var(--text-sm);
    }
</style>