<script lang="ts">
    export let id: string;
    export let options: {name: string, value?: string | number, active: boolean}[];
    export let onChange: (e: Event) => void;
</script>

<select 
    id={id}
    on:change={onChange}
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
    letter-spacing: 0.0625rem;
    border: 1px solid white;
    background-color: transparent;
}
</style>
