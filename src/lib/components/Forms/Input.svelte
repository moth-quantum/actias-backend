<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { mute } from '$lib/stores/global';

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

    const handleInput = (event) => {
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
    on:input={handleInput}
    on:change={() => dispatch('change', value)}
    on:keydown={e => {
        mute.set(true)
        e.key === 'Enter' && value !== '' && dispatch('enter', value) && (value = '')
    }}
    on:keyup={() => {
        mute.set(false)
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
    }

    input::placeholder {
        color: white;
    }

    :focus {
        outline: var(--color-theme-1)
    }
</style>