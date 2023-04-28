<script lang='ts'>
    import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
    import { FontAwesomeIcon } from 'fontawesome-svelte';

    export let classes: string = '';
    export let text: string;
    export let icon: IconDefinition | null = null;
    export let active: boolean = true;
    export let disabled: boolean = false;
    export let colour: string;
    export let onClick: () => void;
</script>

<button
    class:active={active}
    class={`btn btn--${colour} ${disabled ? 'btn--disabled' : ''} ${classes}`}
    on:click={onClick}
>
    {#if icon}
        <span class="btn__icon">
            <FontAwesomeIcon {icon} />
        </span>
    {/if}
    {#if text}
        <span class="ml-2">{text}</span>
    {/if}
</button>

<style lang="scss">
    .btn {
        font-size: var(--text-sm);
        padding: 0.25rem 2rem;
        text-transform: uppercase;
        color: var(--color-grey-mid);
        border-radius: 5px;
        font-weight: 500;
        height: 100%;

        &:last-child {
            margin-right: 0;
        }

        &:hover {
            background-color: auto;
        }
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