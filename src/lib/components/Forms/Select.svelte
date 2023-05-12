<script lang="ts">
    export let id: string;
    export let options: {name: string, active: boolean}[];
    export let onChange: (e: Event) => void;
</script>

<select 
    id={id}
    on:change={onChange}
>
    {#each options as {name, active}}
        <option disabled={!active}>{name}</option>
    {/each}
</select>

<style>

select {
    font-size: var(--text-sm);
    color: var(--color-grey-mid);
    padding: 0.125rem 0.75rem;
    width: 100%;
    border-radius: 5px;
    height: 100%;
    text-transform: uppercase;
}
</style>
