<script lang="ts">
    import Socket from "./Socket.svelte";

    export let ids: string[];
    export let labels: string[];

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
    {#each ids as id, i}
        <div class="socket">
            <h3 style="color: {colours[i]}">{labels[i]}</h3>
            <Socket {id} type="remote" colour={colours[i]} offset={offsets[i]}/>
        </div>
    {/each}
</div>

<style lang="scss">
    .patchbay {
        width: 100%;
        display: flex;
        justify-content: center;
    }
    
    h3 {
        font-size: 1rem;
        text-align: center;
        transform: translate(1px,0);
        margin-bottom: 0.25rem;
    }
    .socket {
        display: flex;
        flex-direction: column;
        margin-right: 2rem;
    
        &:last-child {
            margin-right: 0;
        }
    }

    
</style>