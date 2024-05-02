<script lang="ts">
    // @ts-nocheck
    import { clamp } from "$lib/utils/utils";
    import Learnable from "$lib/components/Learnable/Learnable.svelte";
    export let id: string = '';
    export let name;
    export let value; 
    export let min = 0;
    export let max = 1;
    export let rotRange = 2 * Math.PI * 0.8;
    export let pixelRange = 200;
    export let startRotation = -Math.PI * 0.8;
    
    let startY, startValue;
    $: valueRange = max - min;
    $: rotation = startRotation + (value - min) / valueRange * rotRange;
    
    function pointerMove({ clientY }) {
        const valueDiff = valueRange * (clientY - startY) / pixelRange;
        value = clamp(startValue - valueDiff, min, max)
    }
    
    function pointerDown({ clientY }) {
        startY = clientY;
        startValue = value;
        window.addEventListener('pointermove', pointerMove);
        window.addEventListener('pointerup', pointerUp);
    }
    
    function pointerUp() {
        window.removeEventListener('pointermove', pointerMove);
        window.removeEventListener('pointerup', pointerUp);
    }
</script>

<div class="knob__container">
    <div class="knob__gradient" style="--rotation: {rotation}"></div>
    <svg viewBox="-10 -10 20 20">
        <circle r="9" stroke="none" stroke-width="0.5" fill="var(--color-grey-dark)"/>
    </svg>
    <div class="knob">
        <div class="knob__inner" style="--rotation: {rotation}" on:pointerdown={pointerDown}>
            <div class="knob__indicator"></div>
        </div>
    </div>
    <Learnable id={id}>
        <p class="knob__label">{name}</p>
    </Learnable>
</div>

<style lang="scss">

	.knob {
        touch-action: none;
		background: var(--color-grey-mid);
		width: 2.5rem;
		height: 2.5rem;
		user-select: none;
		border-radius: 50%;
        border: 1px solid black;
        margin-bottom: 0.5rem;
        z-index: 10;
        box-shadow: 0px 10px 10px 0px var(--color-grey-darker);

        &__container {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
        }

        &__inner {
            width: 100%;
            height: 100%;
            user-select: none;
    		transform: rotate(calc(var(--rotation) * 1rad));
        }
	}

    .knob__indicator {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: white;
        position: relative;
        top: 15%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-shadow:
            0 0 1.5px 0.75px #fff;  /* inner white */
            /* 0 0 100px 60px #f0f; */
            /* 0 0 140px 90px #0ff; outer cyan */
    }

    .knob__label {
        font-size: var(--text-xxs);
        color: var(--color-yellow);
        text-transform: uppercase;
        text-align: center;
        // width: 97%;
        // height: 2.5rem;
        background-color: var(--color-grey-dark);
        // position: absolute;
        // bottom: -0.5rem;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        padding-bottom: 0.1rem;
    }

    svg {
        position: absolute;
        width: 3.1rem;
        height: 3.1rem;
        top: -0.3rem;
        left: -0.3rem;
        bottom: -0.3rem;
        right: -0.3rem;
    }

    .knob__gradient {
        position: absolute;
        width: 3rem;
        height: 3rem;
        top: -0.25rem;
        left: -0.25rem;
        bottom: -0.25rem;
        right: -0.25rem;
        border-radius: 50%;
        background: conic-gradient(var(--color-grey-mid) #{calc(3.14rad - var(--rotation) * 1rad)}, var(--color-theme-1), white);
        transform: rotate(calc(var(--rotation) * 1rad));
    }
</style>