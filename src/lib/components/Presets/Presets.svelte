<script lang="ts">
    import { presetKeys, activePreset } from '$lib/stores/presets';
    import { FontAwesomeIcon } from 'fontawesome-svelte';
    import { library } from '@fortawesome/fontawesome-svg-core';
    import { faChevronLeft, faChevronRight, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
    library.add(faChevronLeft, faChevronRight, faFloppyDisk);

    const onNext = () => $activePreset < $presetKeys.length && activePreset.set($activePreset + 1)
    const onPrev = () => $activePreset > 0 && activePreset.set($activePreset - 1)

</script>

<div class="presets">
    <button class="presets__chevron" on:click={onPrev} disabled={$activePreset === 0}>
        <FontAwesomeIcon icon={faChevronLeft} class={$activePreset === 0 && 'opacity-20'} />
    </button>

    <span class="presets__input">
        <input type="text" class="presets__input" bind:value={$presetKeys[$activePreset]} />
    </span>

    <span class="presets__store">
        <FontAwesomeIcon icon={faFloppyDisk} />
    </span>
    

    <button class="presets__chevron" on:click={onNext} disabled={$activePreset === $presetKeys.length - 1}>
        <FontAwesomeIcon icon={faChevronRight} />
    </button>

</div>

<style lang="scss">
    .presets {
        background-color: var(--color-yellow);
        border-radius: 5px;
        font-size: var(--text-sm);
        padding: 0.25rem 1rem;
        text-transform: uppercase;
        color: var(--color-grey-mid);
        border-radius: 5px;
        font-weight: 500;
        display: flex;
        align-items: center;
        &__chevron {
            width: 1.5rem;
            text-align: center;
            cursor: pointer;
        }
        &__input {
            border: none;
            background-color: transparent;
            color: var(--color-grey-mid);
            font-size: var(--text-sm);
            font-weight: 500;
            text-transform: uppercase;
            text-align: center;
            width: 5rem;
            padding: 0;
        }

        &__store {
            margin: 0 0.5rem;
            cursor: pointer;
        }
    }

    button:disabled {
        opacity: 0.2;
        cursor: not-allowed;
    }
</style>