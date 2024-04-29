<script lang="ts">
	export let element: string = '';
	export let message: string;
	export let classes: string = '';
</script>

<div class="tooltip {classes}">
	{message}
</div>

<style>
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

	.tooltip--measure {
		bottom: 5rem;
	}

	.tooltip--drone {
		bottom: 12rem;
	}

	.tooltip--show {
		opacity: 1;
		transition: opacity 0.2s;
	}

	
</style>
