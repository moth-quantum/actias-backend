<script lang="ts">
    export let min: number = 0;
    export let max: number = 1;
    export let step: number = 0.01;
    export let name: string = '';
    export let value: number = 0.5;
    export let colour: string = '#000';
    export let orientation: string = 'vertical';
</script>

<div class="slider__container">
    <span 
        class={'label label--' + orientation}
        style={`color: ${colour}`}    
    >{name}</span>
    <!-- <input 
        class={`${orientation}`} 
        type="range" {min} {max} {step}
        bind:value={value}
        style={`background: ${colour}`}
    /> -->

    <div class="slider">
        <div class="slider__track" style={`background: ${colour}`}></div>
        <div class="slider__thumb"></div>
    </div>
</div>

<style lang="scss">

    .slider__container {
        display: flex;
        flex-direction: column;
    }
    .slider {
        display: flex;
        justify-content: center;
        position: relative;
        width: 100%;
        height: 100%;
        &__track {
            width: 2px;
            height: 100%;
            background-color: blue;
        }
    }

    .label {
        color: var(--color-grey-light);
        font-size: var(--text-base);
        text-align: center;
        margin-right: 1rem;
        margin-bottom: 0.5rem;
        min-width: 0.5rem;
        width: 100%;
    }

    input[type=range] {
        appearance: none;
        outline: none; 
        margin: 0;
        width: calc(100% - 1rem);
        height: 2px;
    }
    
    /* Annoyingly, lots of repeated css, but doesn't work otherwise */
    input::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 8px;
        height: 16px;
        background: linear-gradient(to left, #000, #000 35%, var(--color-grey-light) 35%, var(--color-grey-light) 65%, #000 65%);
        border-radius: 0;
        cursor: pointer;
        position: relative;
        box-shadow: 2px 3px 5px 1px var(--color-box-shadow);
    }

    input:-moz-range-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 8px;
        height: 16px;
        background: linear-gradient(to left, #000, #000 35%, var(--color-grey-light) 35%, var(--color-grey-light) 65%, #000 65%);
        border-radius: 0;
        cursor: pointer;
        position: relative;
        box-shadow: 2px 3px 5px 1px var(--color-box-shadow);
    }
</style>