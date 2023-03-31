<div class="knob__container">
    <div class="knob" style="--rotation: {rotation}" on:pointerdown={pointerDown}>
        <div class="knob__indicator"></div>
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
    }
	.knob {
		background: lightgray;
		width: 2rem;
		height: 2rem;
		user-select: none;
		border-radius: 50%;
		transform: rotate(calc(var(--rotation) * 1rad));
        margin-bottom: 0.5rem;
	}

    .knob__indicator {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: var(--color-theme-1);
        position: relative;
        top: 15%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .knob__label {
        font-size: var(--text-xxs);
        color: var(--color-yellow);
        text-transform: uppercase;
        text-align: center;
    }
</style>