<script>
    import Socket from "./Socket.svelte";
    /**
    * @type {string[]}
    */
    export let ids;
    
    /**
    * @type {string}
    */
     export let title;
</script>

<div class="patchbay">
    <h2>{title}</h2>
    {#each ids as id}
        <h3>{id}</h3>
        <Socket {id} type="remote" />
    {/each}
</div>

<style>
    .patchbay {
        border: 1px solid black;
        padding: 1rem;
        display: inline-block;
    }
</style>