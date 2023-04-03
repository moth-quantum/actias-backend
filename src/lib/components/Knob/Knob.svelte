<div class="knob__container">
    <svg viewBox="-10 -10 20 20">
        <circle r="9" stroke="var(--color-grey-mid)" stroke-width="0.5" fill="none" />
    </svg>
    <div class="knob" style="--rotation: {rotation}" on:pointerdown={pointerDown}>
        <div class="knob__indicator"></div>
        <!-- svg circle around the knob -->
    </div>
    <div class="knob__label">{name}</div>
</div>


<script>
    // @ts-nocheck
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
	
	function clamp(num, min, max) {
		return Math.max(min, Math.min(num, max));
	}
	
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


<style>

    .knob__container {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
    }
	.knob {
		background: var(--color-grey-mid);
		width: 2.5rem;
		height: 2.5rem;
		user-select: none;
		border-radius: 50%;
		transform: rotate(calc(var(--rotation) * 1rad));
        margin-bottom: 0.5rem;
        z-index: 10;
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
        width: 80%;
        height: 1.5rem;
        background-color: var(--color-grey-dark);
        position: absolute;
        bottom: -0.5rem;
        display: flex;
        align-items: end;
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
</style>