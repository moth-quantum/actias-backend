<script lang='ts'>
    export let text: string;
    export let icon: string = '';
    export let active: boolean;
    export let disabled: boolean = false;
    export let colour: string;
    export let onClick: () => void;
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
        padding: 0.25rem 2rem;
        text-transform: uppercase;
        color: var(--color-grey-mid);
        border-radius: 5px;
        font-weight: 500;
        margin-right: 0.5rem;
    }

    .btn:last-child {
        margin-right: 0;
    }
    span {
        margin: 0
    }

    .btn--primary {
        background-color: var(--color-theme-1);
    }

    .btn--secondary {
        background-color: var(--color-theme-2);
    }

    .btn--tertiary {
        background-color: var(--color-theme-3);
    }

    .btn--yellow {
        background-color: var(--color-yellow);
    }

    .btn--disabled {
        background-color: var(--color-grey-light);
        opacity: 0.5;
    }
</style>