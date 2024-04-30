<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    export let id: string = '';
    export let placeholder: string = '';
    export let value: string | number = '';
    export let label: string = '';
    export let showLabel: boolean = true;
    export let border: string = 'none';
    export let color: string = 'white';
    export let classes: string = '';
    export let uppercase: boolean = false;
    export let type: string = 'text';
    export let readonly: boolean = false;
    
    const handleInput = (event: any) => {
        value = event.target.value;
    };
</script>

{#if showLabel}
    <label class="title" for={id}>{label}</label>
{/if}

<input 
    {id} 
    {placeholder} 
    {value}
    {type}
    {readonly}
    on:input={handleInput}
    on:change={() => dispatch('change', value)}
    on:keydown={e => {
        e.stopPropagation()
        e.key === 'Enter' && value !== '' && dispatch('enter', value)
        e.key === 'Escape' && dispatch('escape', value)
    }}
    style={`
        border: ${border}; 
        color: ${color}; 
        text-transform: ${uppercase ? 'uppercase' : 'none'};
        padding-left: ${showLabel ? '0' : 'auto'}
        `
    }
    class={classes}
/>

<style lang="scss">
    input {
        border-radius: 5px;
        padding: 0.25rem 2rem 0.25rem 1rem;
        height: 100%;
        background-color: transparent;
        font-size: var(--text-sm);
        width: 100%;
        :focus {
            outline: var(--color-theme-1)
        }
    }

    input::placeholder {
        color: white;
    }

    
</style>