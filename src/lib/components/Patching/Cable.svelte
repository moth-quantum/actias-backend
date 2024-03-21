<script>
    // @ts-nocheck
    import { onDestroy, onMount } from 'svelte';
    export let from = {};
    export let to = {};
    export let offset = 2;
    export let colour = 'blue';
    
    let w = window.innerWidth
    let h = document.body.scrollHeight

    function resize() {
        w = window.innerWidth;
        h = document.body.scrollHeight;
    }

    // resize if document body changes size
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(document.body)

    onMount(resize);
    onDestroy(() => resizeObserver.disconnect());

    $: segments = [
        {x1: from.x + 3, y1: from.y, x2: to.x + (from.x - to.x)/2 + offset, y2: from.y},
        {x1: to.x + (from.x - to.x)/2 + offset, y1: from.y, x2: to.x + (from.x - to.x)/2 + offset, y2: to.y},
        {x1: to.x + (from.x - to.x)/2 + offset, y1: to.y, x2: to.x, y2: to.y}
    ]

</script>

<svg 
    viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg"
    class="svg"
>
    <circle 
        class="socket"
        cx={from.x} cy={from.y} r="3" stroke={colour} stroke-width="1.5" fill="white"
    />
        {#each segments as {x1, y1, x2, y2}}
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
        z-index: 20;
    }

    .socket {
        z-index: 19;
    }
    .cable {
        z-index: 18;
    }
</style>