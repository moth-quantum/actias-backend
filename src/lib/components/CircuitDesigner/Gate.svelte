<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    import { draggable } from '@neodrag/svelte';
    
    const dispatch = createEventDispatcher();

    export let id: number;
    export let symbol: string;

    let thisGate: HTMLButtonElement;
    let position = {x: 0, y: 0};

    onMount(() => {
        const position = thisGate?.getBoundingClientRect();
        // const x = position.x + window.scrollX;
        // const y = position.y + window.scrollY;
        // const width = position.width;
    });

    function handleDragEnd(e: CustomEvent) {
        // const target = e.target?.getBoundingClientRect();
        // const targetX = target.x + window.scrollX;
        // const targetY = target.y + window.scrollY;
        
        // // find connecting socket
        // const socketId = Object.keys($sockets).find(id => {
        //     const {x, y, width} = $sockets[id];
        //     return targetX > x - width && targetX < x + width && targetY > y - width && targetY < y + width;
        // });
        
        // // if socket found and not of same type, connect
        // socketId && connectSockets($sockets[id], $sockets[socketId]);
        
        // // return to original position
        position = {x: 0, y: 0}
        // thisSocket.style.zIndex = 10;
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
>
    <span
        use:draggable={{bounds: 'body', position}}
        on:neodrag:end={handleDragEnd}
    >
        {symbol}
    </span>
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
        @media (min-width: 1200px){
            width: calc(100%/3 - (1rem/3));
        }

        span {
            cursor: pointer;
            display: inline-block;
            padding: 1rem;
            background-color: var(--color-grey-darkest);
            text-align: center;
            position: absolute;
            
            margin: auto;
            border-radius: 5px;
        }
    }
</style>