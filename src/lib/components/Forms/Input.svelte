<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    export let id: string = '';
    export let placeholder: string = '';
    export let value: string | number = '';
    export let label: string = '';
</script>

<label class="title" for={id}>{label}</label>
<input 
    {id} {placeholder} bind:value 
    on:change={() => dispatch('change', value)}
    on:keydown={e => e.key === 'Enter' && value !== '' && dispatch('enter', value) && (value = '')}
/>

<style lang="scss">
    input {
        color: white;
        padding: 0.5rem 0;
        border: none;
        background-color: transparent;
        font-size: var(--text-sm);
    }

    input::placeholder {
        color: var(--color-grey-mid);
    }

    :focus {
        outline: var(--color-theme-1)
    }
</style>