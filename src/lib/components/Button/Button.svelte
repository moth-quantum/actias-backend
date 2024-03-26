<script lang='ts'>
    import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
    import { FontAwesomeIcon } from 'fontawesome-svelte';

    export let classes: string = '';
    export let text: string = '';
    export let icon: IconDefinition | null = null;
    export let image: string = '';
    export let active: boolean = true;
    export let disabled: boolean = false;
    export let colour: string;
    export let orientation: string = 'horizontal';
    export let border: boolean = false;
    export let onClick: () => void;
</script>

<button
    class:active={active}
    class={`btn btn--${colour} ${disabled ? 'btn--disabled' : ''} ${orientation === 'vertical' ? 'btn--vertical' : ''} ${border ? 'btn--border' : ''} ${classes}`}
    on:click={onClick}
>
    {#if icon}
        <span class="btn__icon">
            <FontAwesomeIcon {icon} />
        </span>
    {/if}
    {#if image}
        <img src={image} alt={text} />
    {/if}
    {#if text}
        <span class="btn__text">{text}</span>
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
        letter-spacing: 0.0625rem;

        &:last-child {
            margin-right: 0;
        }

        &:hover {
            background-color: auto;
        }

        & img {
            height: 1.5rem;
            margin: 0.4rem 0;
        }
    }

    .btn__text {
        margin-left: 0.5rem;
    }

    .btn--vertical {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0 1rem;

        & .btn__icon {
            font-size: 1.5rem;
        }

        & .btn__text {
            margin-left: 0;
            max-width: 5rem;
            font-size: var(--text-xs);
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

    .btn--dark {
        background-color: var(--color-grey-darkest);
        color: white;
    }

    .btn--grey {
        background-color: var(--color-grey-mid);
        color: var(--color-yellow);


        &.active {
            background-color: var(--color-yellow);
            color: var(--color-white);
        }

        &.btn--border {
            border: 1px solid var(--color-grey-light);
        }
    }

    .btn--disabled {
        background-color: var(--color-grey-light);
        opacity: 0.5;
    }
</style>