<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    /**
    * @type {boolean}
    */
    export let isActive = false;
    /**
    * @type {number}
    */
    export let note;
    
    /**
     * @type {'white' | 'black'}
    */
    export let colour;
</script>

<div class="key key--{colour}">
    <div 
        on:mousedown={() => dispatch('down', note)}
        on:mouseup={() => dispatch('up', note)}
        on:mouseleave={() => dispatch('leave', note)}
        on:mouseenter={() => dispatch('enter' ,note)}
        class="inner piano-{colour} note-{note} {isActive ? 'active' : ''}"
    ></div>
</div>

<style>
    .key {
        display: inline-block;
        position: relative;
        vertical-align: top;
        direction: ltr;
        margin: 0;
        padding: 0;
    }

    .key--black {
        width: 0px;
        height: 100px;
        z-index: 2;
    }

    .inner {
        border-radius: 2px;
        border-color: #222;
        border-style: solid;
        border-width: 1px 1px 1px 1px;
        cursor: pointer;
    }

    .key--white > .inner {
        width: 24px;
        height: 100px;
        background-color: white;
        z-index: 1;
    }
    .key--white > .inner.active {
        background-color: #000;
    }
    
    .key--black > .inner {
        width: 16px;
        height: 70px;
        position: relative;
        left: -10px;
        background-color: black;
    }

    .key--black > .inner.active {
        background-color: #fff;
    }

</style>