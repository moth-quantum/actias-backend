<script lang="ts">
    export let checked = false;
    export let onChange: (checked: boolean) => void;
</script>

<input type="checkbox" bind:checked on:change={e => onChange(e.target?.checked || false)}>

<style lang="scss">
    input[type=checkbox] {
        -webkit-appearance: none;
        background-color: transparent;
        border: 1px solid #cacece;
        padding: 9px;
        border-radius: 5px;
        display: inline-block;
        position: relative;
    }
</style>