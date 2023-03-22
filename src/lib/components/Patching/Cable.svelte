<script>
    // @ts-nocheck
    import { onDestroy, onMount } from 'svelte';
    export let from = {};
    export let to = {};
    export let offset = 2;
    export let colour = 'blue';
    
    let w = 0
    let h = 0;

    function resize() {
        w = window.innerWidth;
        h = document.body.scrollHeight;
    }

    // resize if document body changes size
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(document.body)

    onMount(resize);
    onDestroy(() => resizeObserver.disconnect());

</script>

<svelte:window on:resize={resize}/>

<svg 
    viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg"
    class="svg"
>
    <circle 
        class="socket"
        cx={from.x} cy={from.y} r="3" stroke={colour} stroke-width="1.5" fill="white"
    />
        {#each [
            {x1: from.x + 3, y1: from.y, x2: to.x + (from.x - to.x)/2 + offset, y2: from.y},
            {x1: to.x + (from.x - to.x)/2 + offset, y1: from.y, x2: to.x + (from.x - to.x)/2 + offset, y2: to.y},
            {x1: to.x + (from.x - to.x)/2 + offset, y1: to.y, x2: to.x, y2: to.y}
        ] as {x1, y1, x2, y2}}
            <line 
                class="cable"
                {x1} {x2} {y1} {y2}
                stroke={colour} stroke-width="2"
            />
        {/each}
    <circle 
        class="socket"
        cx={to.x} cy={to.y} r="3" stroke={colour} stroke-width="1.5" fill="white"
    />
</svg>

<style>
    .svg {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        pointer-events: none;
        z-index: 1000;
    }

    .socket {
        z-index: 1001;
    }
    .cable {
        z-index: 1000;
    }
</style>