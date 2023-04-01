<script lang="ts">
    import { connections } from "$lib/stores/patching";
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
            style="background-color: {colours[i]}"
            on:click={() => console.log(option)}
            class:active={$connections.some(([c1,c2]) => c1 === id && c2 === option)}
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