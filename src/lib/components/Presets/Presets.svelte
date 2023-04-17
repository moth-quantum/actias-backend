<script lang="ts">
    import { FontAwesomeIcon } from 'fontawesome-svelte';
    import { library } from '@fortawesome/fontawesome-svg-core';
    import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
    
    library.add(faChevronLeft, faChevronRight);

    const onNext = () => {
        console.log('next');
    }

    const onPrev = () => {
        console.log('prev');
    }

</script>

<div class="presets">
    <button class="presets__chevron">
        <FontAwesomeIcon icon="chevron-left" />
    </button>

    <span class="mx-4">Presets</span>

    <button class="presets__chevron">
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
    }
</style>