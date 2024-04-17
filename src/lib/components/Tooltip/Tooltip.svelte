<script lang="ts">
	import { tooltip } from '$lib/stores/global';
	import { onMount } from 'svelte';
	export let message: string;
	export let classes: string;
</script>

<div class="tooltip {classes}">
	{message}
</div>

<style>
	.tooltip {
		position: absolute;
		background: #7FD6D1;
		color: black;
		padding: 0.5rem;
		border-radius: 0.5rem;
		opacity: 0.9;
		transition: opacity 0.2s;
		z-index: 1000;
	}
</style>
