<script lang='ts'>
    import { type IconDefinition } from '@fortawesome/fontawesome-svg-core';
    import { FontAwesomeIcon } from 'fontawesome-svelte';
    export let text: string;
    export let icon: IconDefinition | null = null;
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
    {#if text}
        <span>{text}</span>
    {/if}
    {#if icon}
    <span class="btn__icon">
        <FontAwesomeIcon {icon} size="2x"/>
    </span>
    {/if}
</button>

<style lang="scss">
    .btn {
        font-size: var(--text-sm);
        padding: 1rem;
        text-transform: uppercase;
        color: var(--color-grey-light);
        border-radius: 5px;
        font-weight: 500;
        background-color: var(--color-grey-mid);
        height: 100%;
        margin-bottom: 0.5rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        
        &:last-child {
            margin-bottom: 0;
        }
    
        &--disabled {
            background-color: var(--color-grey-light);
            opacity: 0.5;
        }
    }


    .active {
        background-color: var(--color-yellow);
        color: var(--color-white);
    }
</style>