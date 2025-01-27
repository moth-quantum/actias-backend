<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { draggable } from '@neodrag/svelte';
    
    const dispatch = createEventDispatcher();

    export let id: number;
    export let symbol: string;
    export let disabled: boolean = false;
    let isDragging: boolean = false;

    let thisGate: HTMLButtonElement;
    let position = {x: 0, y: 0};

    function handleDragEnd(e: CustomEvent) {

        const target = e.target as HTMLElement;
        const bounds = target.getBoundingClientRect() as DOMRect;
        const x = bounds.x + window.scrollX;
        const y = bounds.y + window.scrollY;
        dispatch('dragend', {id, x, y});
        
        position = {x: 0, y: 0}
        isDragging = false;
    }

    function handleDrag(e: CustomEvent) {
        const target = e.target as HTMLElement;
        const bounds = target.getBoundingClientRect() as DOMRect;
        const x = bounds.x + window.scrollX;
        const y = bounds.y + window.scrollY;
        dispatch('drag', {id, x, y});
    }
    
    function handleDragStart() {
        isDragging = true;
        dispatch('dragstart', {id});
    }

</script>

<button 
    bind:this={thisGate}
    on:focus={() => dispatch('mouseover', {id})}
    on:mouseover={() => dispatch('mouseover', {id})}
    on:blur={() => dispatch('mouseout', {id})}
    on:mouseout={() => dispatch('mouseout', {id})}
    on:click={() => dispatch('click', {id})}
    class="gate"
    disabled={disabled}
>
    {#if !disabled}
        <span
            use:draggable={{bounds: 'body', position}}
            on:neodrag:end={handleDragEnd}
            on:neodrag:start={handleDragStart}
            on:neodrag={handleDrag}
            class:grab={isDragging}
        >
            {symbol}
        </span>
    {/if}
    {symbol}
</button>

<style lang="scss">
    .gate {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        background-color: var(--color-grey-darkest);
        color: var(--color-theme-1);
        margin-bottom: 0.5rem;
        padding: 1.25rem 0;
        border-radius: 10px;
        width: calc(100%/2 - 0.25rem);

        &:disabled {
            cursor: not-allowed;
            opacity: 0.5;
        }

        span {
            cursor: grab;
            display: inline-block;
            padding: 1rem;
            background-color: var(--color-grey-darkest);
            text-align: center;
            position: absolute;
            
            margin: auto;
            border-radius: 5px;
            &.grab {
                cursor: grabbing;
                z-index: 20;
                border: var(--color-theme-1) 2px solid;
                border-radius: 0;
                width: 40px;
                height: 40px;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }

        @media (min-width: 1200px){
            width: calc(100%/3 - (1rem/3));
        }
    }

</style>