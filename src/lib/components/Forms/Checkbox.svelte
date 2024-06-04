<script lang="ts">
    export let label = ''; 
    export let checked = false;
    export let onChange: (checked: boolean) => void;


    const handleOnChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        onChange(target.checked);
    }
</script>

<label>
    <input type="checkbox" bind:checked on:change={handleOnChange}/>
    {#if label}
        <span>{label}</span>
    {/if}
</label>

<style lang="scss">
    label {
        display: flex;
        align-items: center;
    }
    span {
        font-size: var(--text-xs);
        color: white;
        margin-left: 0.25rem
    }
    input[type=checkbox] {
        -webkit-appearance: none;
        appearance: none;
        background-color: transparent;
        border: 1px solid #cacece;
        padding: 9px;
        border-radius: 5px;
        display: inline-block;
        position: relative;
    }
</style>