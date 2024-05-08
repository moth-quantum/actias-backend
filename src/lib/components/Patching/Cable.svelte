<script>
    // @ts-nocheck
    import { onDestroy, onMount } from 'svelte';
    export let from = {x: 0, y:0};
    export let to = {x: 0, y: 0};
    export let offset = 2;
    export let colour = 'blue';
    export let isFocused = false;
    
    let w = 0;
    let h = 0;
    let resizeObserver;
    
    onMount(() => {
        function resize() {
            w = window.innerWidth;
            h = document.body.scrollHeight;
        }
        
        // resize if document body changes size
        resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(document.body)
        resize()
    });
    onDestroy(() => resizeObserver.disconnect());

    $: line1 = {x1: from.x + 3, y1: from.y, x2: from.x + 43 + offset, y2: from.y}
    $: line2 = {x1: line1.x2, y1: from.y, x2: line1.x2, y2: to.y + 23 - offset}
    $: line3 = {x1: line2.x1, y1: line2.y2, x2: to.x, y2: line2.y2}
    $: line4 = {x1: line3.x2, y1: line3.y2, x2: to.x, y2: to.y}
    $: segments = [
        line1,
        line2,
        line3,
        line4,
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
                class:cable--focused={isFocused}
                {x1} {x2} {y1} {y2}
                stroke={colour} stroke-width="2"
            />
        {/each}
    <circle 
        class="socket"
        cx={to.x} cy={to.y} r="3" stroke={colour} stroke-width="1.5" fill="white"
    />
</svg>

<style lang="scss">
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
        display: none;

        &--focused {
            display: block;
        }
    }
</style>