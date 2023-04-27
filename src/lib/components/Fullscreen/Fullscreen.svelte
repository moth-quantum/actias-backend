<script lang='ts'>
    import { fullscreen } from '$lib/stores/global';
    import { FontAwesomeIcon } from 'fontawesome-svelte';
    import { library } from '@fortawesome/fontawesome-svg-core';
    import { faExpand } from '@fortawesome/free-solid-svg-icons';
    library.add(faExpand);
</script>

<button on:click={() => fullscreen.set(!$fullscreen)}>
    <FontAwesomeIcon icon={faExpand}/>
</button>

<svelte:window on:keydown={e => {
    e.key === 'f' && fullscreen.set(!$fullscreen);
    e.key === 'Escape' && fullscreen.set(false);
}}/>

<style lang="scss">
    button {
        display: none;
        @media (min-width: 1200px) {
            position: relative;
            font-size: 1.5rem;
            color: var(--color-grey-light);
            opacity: 0.5;
            display: flex;
            align-items: end;
            cursor: pointer;
            z-index: 100;
        }
    }
</style>