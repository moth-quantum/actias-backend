<script lang='ts'>
    export let text: string;
    export let icon: string = '';
    export let active: boolean = false;
    export let disabled: boolean = false;
    export let colour: string;
    export let onClick: () => void = () => {};
</script>

<button
    class:active={active}
    class={`btn btn--${colour} ${disabled ? 'btn--disabled' : ''}`}
    on:click={onClick}
>
    {#if icon}
        <span class="material-icons">{icon}</span>
    {/if}
    {#if text}
        <span class="ml-2">{text}</span>
    {/if}
</button>

<style>
    .btn {
        font-size: var(--text-sm);
        padding: 0;
        text-transform: uppercase;
        color: var(--color-grey-light);
        border-radius: 5px;
        font-weight: 500;
        background-color: var(--color-grey-mid);
        height: 100%;
        margin-bottom: 0.5rem;
    }

    span { margin: 0}

    .btn:last-child {
        margin-bottom: 0;
    }

    .btn--disabled {
        background-color: var(--color-grey-light);
        opacity: 0.5;
    }

    .active {
        background-color: var(--color-yellow);
        color: var(--color-white);
    }
</style>