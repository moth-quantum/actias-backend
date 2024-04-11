<script>
    export let min = 0;
    export let max = 1;
    export let step = 0.01;
    export let units = '%';
    export let rangeA = 0;
    export let rangeB = 1;
    export let value = 0.5;
</script>

<div class="range-slider">
    <span class="">{rangeA.toLocaleString('fullwide', {maximumFractionDigits: 2})}{units}</span>
    <div class="slider">
        <input class="min" type="range" {min} {max} {step} bind:value={rangeA} />
        <input class="track" type="range" {min} {max} {step} {value} disabled/>
        <input class="max" type="range" {min} {max} {step} bind:value={rangeB} />
    </div>
    <span class="">{rangeB.toLocaleString('fullwide', {maximumFractionDigits: 2})}{units}</span>
</div>

<style lang="scss">
    .range-slider {
        display: grid;
        @media (min-width: 1200px) {
            grid-template-columns: 1fr 4fr 1fr;
        }
        align-items: center;
    }
    .slider {
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;
        width: 100%;
        padding: 0 0.25rem;
    }

    span {
        display: none;
        @media (min-width: 1200px) {
            display: block;
        }
        color: var(--color-grey-light);
        font-size: var(--text-xxs);
        text-align: center;
    }

    input[type=range] {
        width: 100%;
        -webkit-appearance: none;  /* Override default CSS styles */
        appearance: none;
        background: transparent;  /* Otherwise white in Chrome */
        outline: none; 
        margin: 0;
        height: 2px;
    }

    input[type=range].track {
        background: var(--color-grey-dark);
    }

    input[type=range]::-moz-range-progress {
        background-color: transparent;
    }
    
    /* Annoyingly, lots of repeated css, but doesn't work otherwise */
    .min::-webkit-slider-thumb, .max::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 8px;
        height: 16px;
        background: linear-gradient(to left, #000, #000 35%, var(--color-grey-light) 35%, var(--color-grey-light) 65%, #000 65%);
        border-radius: 0;
        cursor: pointer;
        position: relative;
        box-shadow: 2px 3px 5px 1px var(--color-box-shadow);
        z-index: 10;
    }

    .min::-webkit-slider-thumb {
        top: 2px;
    }

    .max::-webkit-slider-thumb {
        top: -2px;
    }

    // firefox
    .min::-moz-range-thumb, .max::-moz-range-thumb {
        -webkit-appearance: none;
        // appearance: none;
        width: 8px;
        height: 16px;
        background: linear-gradient(to left, var(--color-grey-dark), var(--color-grey-dark) 33%, var(--color-grey-light) 34%, var(--color-grey-light) 66%, var(--color-grey-dark) 66%);
        border-radius: 0;
        position: absolute;
    }

    .min::-moz-range-thumb {
        transform: translateY(2px);
    }

    .max::-moz-range-thumb {
        transform: translateY(-2px);
    }

    .track::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 2px;
        height: 16px;
        border-radius: 0;
        background: var(--color-theme-1);
        cursor: pointer;
        z-index: -10;
    }

    .track::-moz-range-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 2px;
        height: 16px;
        background: var(--color-theme-1);
        cursor: pointer;
        z-index: -10;
    }
</style>