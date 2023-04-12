<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { noteToKey } from './utils';

    const dispatch = createEventDispatcher();
    
    export let isActive: boolean = false;
    export let note: number;
    export let colour: 'white' | 'black';
</script>

<div class="key key--{colour}">
    <div 
        on:mousedown={() => dispatch('down', note)}
        on:mouseup={() => dispatch('up', note)}
        on:mouseleave={() => dispatch('leave', note)}
        on:mouseenter={() => dispatch('enter' ,note)}
        on:touchstart={() => dispatch('touchstart', note)}
        on:touchend={() => dispatch('touchend', note)}
        class="inner piano-{colour} note-{note} {isActive ? 'active' : ''}"
    >
        <span class="label">{noteToKey(note)}</span>
    </div>
</div>

<style lang="scss">
    .key {
        display: flex;
        vertical-align: top;
        direction: ltr;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;

    }

    .key--black {
        width: 0px;
        height: 100%;
        z-index: 2;
        position: relative;
    }

    .inner {
        cursor: pointer;
        border-radius: 0 0 4px 4px;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        padding-bottom: 0.5rem;
    }

    .key--white > .inner {
        width: 100%;
        height: 100%;
        background-color: white;
        z-index: 1;
        border: 1px solid var(--color-grey-mid);
    }
    .key--white > .inner.active, .key--black > .inner.active {
        background-color: var(--color-grey-mid);
    }

    .key--white > .inner.active > span, .key--black > .inner.active > span {
        color: white;
    }
    
    .key--black > .inner {
        width: 24px;
        height: 60%;
        position: absolute;
        left: -12px;
        background-color: var(--color-grey-darker);
    }

    .label {
        color: var(--color-grey-light);
        font-size: var(--text-sm);
    }

</style>