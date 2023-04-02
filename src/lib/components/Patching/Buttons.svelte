<script lang="ts">
    import { connections, sockets, connectSockets } from "$lib/stores/patching";
    export let id: string;
    export let options: string[];
    
    const colours = [
        '#00A399',
        '#E5007F',
        '#FF695A',
    ]
</script>

<div class="buttons">
    {#each options as option, i (option)}
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
        flex-direction: row-reverse;
        justify-content: flex-start;
    }
    button {
        border: 1px solid white;
        border-radius: 5px;
        width: 1rem;
        height: 1.25rem;
        margin-right: 0.25rem;
        color: transparent;
        opacity: 0.5;

        &:first-of-type {
            margin-right: 0;
        }

        &.active {
            opacity: 1;
        }

        &:focus {
            outline: none;
        }
    }
</style>