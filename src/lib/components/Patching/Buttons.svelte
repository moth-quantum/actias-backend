<script lang="ts">
    import { connections, sockets, connectSockets } from "$lib/stores/patching";
    export let id: string;
    export let options: string[];
    
    const colours = [
        '#FF695A',
        '#E5007F',
        '#00A399'
    ]
</script>

<div class="buttons">
    {#each options as option, i}
        <button
            style="background-color: {colours[i%3]}"
            on:click={() => connectSockets($sockets[option], $sockets[id])}
            class:active={$connections.some(arr => arr.includes(id) && arr.includes(option))}
        >{'.'}</button>
    {/each}
</div>

<style lang="scss">
    .buttons {
        display: flex;
        justify-content: flex-end;
    }
    button {
        border: 1px solid white;
        border-radius: 5px;
        width: 1rem;
        height: 1.25rem;
        margin-right: 0.25rem;
        color: transparent;
        opacity: 0.5;

        &.active {
            opacity: 1;
        }
    }
</style>