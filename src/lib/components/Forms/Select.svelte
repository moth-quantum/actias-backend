<script lang="ts">
    export let id: string;
    export let options: string[];
</script>

<select id={id}>
    {#each options as option}
        <option>{option}</option>
    {/each}
</select>

<style>

select {
    font-size: var(--text-sm);
    color: var(--color-grey-mid);
    padding: 0.125rem 0.75rem;
    width: 100%;
    border-radius: 5px;
}
</style>
