<script lang="ts">
	import { tooltips } from '$lib/stores/tooltips';
	export let element: string = '';
	export let classes: string = '';

	let message = $tooltips.find(tooltip => tooltip.element.toLowerCase() === element.toLowerCase())?.message || '';
	let hoveredEl: any = null;
</script>

<div 
	class="tooltip-container" 
	on:mouseenter={() => hoveredEl = element}
	on:mouseleave={() => hoveredEl = null}
>
	<div class="tooltip tooltip--{element} {hoveredEl === element ? 'tooltip--show' : ''} {classes}">
		{message}
	</div>
	<div class="tooltip-element tooltip-element--{element}">
		<slot></slot>
	</div>
</div>

<style>
	.tooltip-container {
		position: relative;
		height: 100%;
    cursor: pointer;

		/* &:hover {
				border-radius: 5px;
				box-shadow: 0 0 8px 8px rgba(7,157,147, 0.9);
				transition: all 0.3s;
		}
		& > button {
				height: 100%;
		} */
	}
	.tooltip {
		position: absolute;
		min-width: 16rem;
		bottom: 2rem;
		background: #7FD6D1;
		color: black;
		padding: 0.5rem;
		border-radius: 0.5rem;
		opacity: 0;
		transition: opacity 0.2s;
		z-index: 1000;
	}

	.tooltip--show {
		opacity: 1;
		transition: opacity 0.2s;
	}
	.tooltip--measure {
		bottom: 5rem;
	}

	.tooltip--drone {
		bottom: 12rem;
	}

	
</style>
