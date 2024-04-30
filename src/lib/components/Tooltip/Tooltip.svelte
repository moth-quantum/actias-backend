<script lang="ts">
	import { tooltips } from '$lib/stores/tooltips';
	export let element: string = '';
	export let classes: string = '';
	export let type: string = '';

	let message = $tooltips.find(tooltip => tooltip.element.toLowerCase() === element.toLowerCase())?.message || '';
	let hoveredEl: any = null;
	let timeoutId: number;
</script>

<div 
	class="tooltip-container" 
>
	<div class="tooltip tooltip--{element} {hoveredEl === element ? 'tooltip--show' : ''} {classes}">
		{message}
	</div>
	<div 
		class="tooltip-element {type ? `tooltip-element--${type}` : ''} tooltip-element--{element}" 
		on:mouseenter={() => {
			clearTimeout(timeoutId);
			hoveredEl = element;
		}}
		on:mouseleave={() => {
				timeoutId = setTimeout(() => {
						hoveredEl = null;
				}, 500); // delay in milliseconds
		}}
		on:mouseenter={() => hoveredEl = element}
		on:mouseleave={() => hoveredEl = null}
	>
		<slot></slot>
	</div>
</div>

<style>
	.tooltip-container {
		position: relative;
		height: 100%;
    cursor: pointer;
	}

	.tooltip {
		position: absolute;
		pointer-events: none;
		min-width: 16rem;
		bottom: calc(100% + 1rem);
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
	.tooltip-element {
		height: 100%;
		
	}

	.tooltip-element:hover {
		border-radius: 5px;
		box-shadow: 0 0 5px 5px rgba(7,157,147, 0.9);
		transition: all 0.3s;
	}

	.tooltip-element--parameter {
		width: fit-content;
	}

	.tooltip-element--parameter:hover {
		background-color: rgba(7,157,147, 0.9);
	}
</style>
