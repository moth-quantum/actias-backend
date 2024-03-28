<script lang="ts">
    import Presets from '$lib/components/Presets/Presets.svelte';
</script>

<svelte:head>
	<title>Circuit Designer</title>
	<meta name="description" content="Design custom quantum circuits using a set of gates. Run simulations in the browser." />
</svelte:head>

<section class="buttons container mx-auto">
    <div class="buttons__inner">        

        <Presets />
    </div>
</section>

<section class="circuit-designer">

</section>

<style lang="scss">
    .buttons {
        @media (min-width: 1200px) {
            padding-bottom: 1.5rem;
        }
        background-color: var(--color-grey-mid);
        &__inner {
            padding: 1rem;
            box-shadow: 0 0.5rem 0.5rem 0.25rem var(--color-box-shadow);
            display: flex;
            justify-content: flex-end;
            @media (min-width: 1200px) {
                padding: 1rem 2rem;
            }

        }
	}
    .circuit-designer {
        display: grid;
        flex-direction: column;
        align-items: center;
    }
</style>