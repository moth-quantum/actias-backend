<script lang="ts">
    export let id: string;
    export let options: {name: string, value?: string | number, active?: boolean}[];
    export let onChange: (e: Event) => void;
    export let selected: string | number;
</script>

<select 
    id={id}
    on:change={onChange}
    bind:value={selected}
>
    {#each options as {name, value, active}}
        <option 
            disabled={!active}
            value={value || name}
        >{name}</option>
    {/each}
</select>

<style>

select {
    font-size: var(--text-sm);
    color: white;
    padding: 0.125rem 0.75rem;
    width: 100%;
    border-radius: 5px;
    height: 100%;

    text-transform: capitalize;
    letter-spacing: 0.0625rem;
    border: 1px solid white;
    background-color: transparent;
}
</style>
