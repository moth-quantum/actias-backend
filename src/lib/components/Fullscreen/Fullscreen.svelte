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
    console.log(e);
    e.key === 'f' && fullscreen.set(!$fullscreen);
    e.key === 'Escape' && fullscreen.set(false);
}}/>

<style lang="scss">
    button {
        position: relative;
        font-size: 2rem;
        color: var(--color-grey-light);
        display: flex;
        align-items: end;
        cursor: pointer;
        z-index: 100;
    }
</style>