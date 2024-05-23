<script lang="ts">
	import { tooltips, showTooltips } from '$lib/stores/tooltips';
	export let element: string = '';
	export let classes: string = '';
	export let type: string = '';

	$: message = $tooltips.find(tooltip => tooltip.element.toLowerCase() === element.toLowerCase())?.message || '';
	let hoveredEl: any = null;
</script>

{#if $showTooltips}
	<div 
		class="tooltip-container" 
	>
		<div class="tooltip tooltip--{element} {hoveredEl === element ? 'tooltip--show' : ''}">
			{message}
		</div>
		<div 
			class="{type !== 'knob' ? 'tooltip-element' : ''} tooltip-element--{type} tooltip-element--{element} {classes}" 
			on:mouseenter={() => hoveredEl = element}
			on:mouseleave={() => hoveredEl = null}
		>
			<slot/>
		</div>
	</div>
{:else}
	<slot/>
{/if}

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
		padding: 1rem;
		border-radius: 5px;
		opacity: 0;
		transition: opacity 0.2s;
		z-index: 1000;
		font-size: var(--text-sm);
		text-align: left;
		font-family: var(--font-body);
		letter-spacing: 0.1rem;
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

	.tooltip-element--knob:hover :global(.knob__inner) {
		border-radius: 50%;
		box-shadow: 0 0 8px 8px rgba(7,157,147, 0.9);
		transition: box-shadow 0.3s;
  }
</style>
