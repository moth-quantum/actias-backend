<script>
    // @ts-nocheck
    export let from = {};
    export let to = {};
    
    let w = window.innerWidth;
    let h = window.innerHeight;

    function resize() {
        w = window.innerWidth;
        h = window.innerHeight;
    }
</script>

<svelte:window on:resize={resize}/>

<svg 
    viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg"
    class="svg"
>
    <line 
        class="cable"
        x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="black" 
    />
  
    <!-- If you do not specify the stroke
         color the line will not be visible -->
</svg>

<style>
    .svg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }
    .cable {
        stroke: black;
        stroke-width: 1;
    }
</style>