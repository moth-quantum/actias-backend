<script lang="ts">
    import Learnable from '$lib/components/Learnable/Learnable.svelte';
    export let id: string;
    export let options: {name: string, value?: string | number, active?: boolean}[];
    export let onChange: (e: Event) => void = () => {};
    export let selected: string | number = options[0].value || options[0]?.name;
    export let background: string = 'transparent';
    export let color: string = 'white';
    export let border: string = '1px solid white';
    export let uppercase: boolean = true;
    export let disabled: boolean = false;
    export let classes: string = '';
    export let isLearnable: boolean = true;
</script>

<Learnable id={id} disabled={!isLearnable}>
    <select 
        id={id}
        on:change={onChange}
        bind:value={selected}
        style={`background-color: ${background}; color: ${color}; border: ${border}; text-transform: ${uppercase ? 'uppercase' : 'none'}`}
        {disabled}
        class={classes}
    >
        {#each options as {name, value, active}}
            <option 
                disabled={!active}
                value={value}
            >{name}</option>
        {/each}
    </select>
</Learnable>

<style>

select {
    font-size: var(--text-sm);
    padding: 0.125rem 2rem 0.125rem 1rem;
    width: 100%;
    border-radius: 5px;
    height: 100%;

    letter-spacing: 0.0625rem;
    border: 1px solid;
}
</style>
