<script lang="ts">
    import Socket from "./Socket.svelte";
    import { randomiseConnections } from "$lib/stores/patching";

    export let ids: string[];
    export let labels: string[];
    export let title: string;

    const colours = [
        '#FF695A',
        '#E5007F',
        '#00A399'
    ]

    const offsets = [
        10,
        0,
        -10
    ]
</script>

<div class="patchbay">
    <h2
        on:click={() => randomiseConnections()}
    >{title}</h2>
    {#each ids as id, i}
        <div class="socket">
            <Socket {id} type="remote" colour={colours[i]} offset={offsets[i]}/>
            <h3 style="color: {colours[i]}">{labels[i]}</h3>
        </div>
    {/each}
</div>

<style>
    .patchbay {
        border: 1px solid var(--color-grey-light);
        background-color: var(--color-grey-mid);
        border-radius: 5px;
        padding: 1rem;
        display: inline-block;
        box-shadow: 2px 3px 5px 1px var(--color-box-shadow);
        width: 4.5rem;
        text-align: center;
    }

    h2 {
        text-align: center;
        margin-bottom: 1rem;
        cursor: pointer;
    }

    h3 {
        font-size: 1rem;
        text-align: right;
    }
    .socket {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .socket:last-child {
        margin-bottom: 0;
    }
</style>