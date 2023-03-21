<script lang="ts">
    import Socket from "./Socket.svelte";

    export let ids: string[];
    export let title: string;

    const colours = [
        '#FF695A',
        '#E5007F',
        '#00A399'
    ]

    const offsets = [
        4,
        -4,
        -12
    ]
</script>

<div class="patchbay">
    <h2>{title}</h2>
    {#each ids as id, i}
        <h3>{id}</h3>
        <Socket {id} type="remote" colour={colours[i]} offset={offsets[i]}/>
    {/each}
</div>

<style>
    .patchbay {
        border: 1px solid var(--color-grey-light);
        background-color: var(--color-grey-mid);
        border-radius: 5px;
        padding: 1rem;
        display: inline-block;
    }
</style>