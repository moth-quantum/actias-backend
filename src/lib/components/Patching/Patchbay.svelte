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
        <div class="socket">
            <Socket {id} type="remote" colour={colours[i]} offset={offsets[i]}/>
            <h3 style="color: {colours[i]}">{id}</h3>
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
    }

    h2 {
        text-align: center;
        margin-bottom: 1rem;
    }

    h3 {
        font-size: 1rem;
        text-align: right;
    }
    .socket {
        width: 2.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .socket:last-child {
        margin-bottom: 0;
    }
</style>