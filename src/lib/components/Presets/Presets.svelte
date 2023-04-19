<script lang="ts">
    import { presetKeys, activePreset } from '$lib/stores/presets';
    import { FontAwesomeIcon } from 'fontawesome-svelte';
    import { library } from '@fortawesome/fontawesome-svg-core';
    import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
    library.add(faChevronLeft, faChevronRight);

    const onNext = () => $activePreset < $presetKeys.length && activePreset.set($activePreset + 1)
    const onPrev = () => $activePreset > 0 && activePreset.set($activePreset - 1)

    const handleChange = (e) => {
        presetKeys.set($presetKeys.map((key, i) => i === $activePreset ? e.target.value : key))
    }

</script>

<div class="presets">
    <button class="presets__chevron" on:click={onPrev} disabled={$activePreset === 0}>
        <FontAwesomeIcon icon="chevron-left" />
    </button>

    <span class="mx-4">
        <input type="text" class="presets__input" value={$presetKeys[$activePreset]} on:change={handleChange}/>
    </span>

    <button class="presets__chevron" on:click={onNext} disabled={$activePreset === $presetKeys.length - 1}>
        <FontAwesomeIcon icon="chevron-right" />
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
    }

    button:disabled {
        opacity: 0.2;
        cursor: not-allowed;
    }
</style>