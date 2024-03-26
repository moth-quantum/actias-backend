<script lang="ts">
    export let id: string;
    export let options: {name: string, value?: string | number, active?: boolean}[];
    export let onChange: (e: Event) => void = () => {};
    export let selected: string | number = options[0].value || options[0].name;
    export let background: string = 'transparent';
    export let color: string = 'white';
    export let border: string = '1px solid white';
    export let uppercase: boolean = true;
</script>

<select 
    id={id}
    on:change={onChange}
    bind:value={selected}
    style={`background-color: ${background}; color: ${color}; border: ${border}; text-transform: ${uppercase ? 'uppercase' : 'none'}`}
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
    padding: 0.125rem 0.75rem;
    width: 100%;
    border-radius: 5px;
    height: 100%;

    letter-spacing: 0.0625rem;
    border: 1px solid;
}
</style>
