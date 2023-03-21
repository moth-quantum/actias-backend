<script>
    export let min = 0;
    export let max = 1;
    export let step = 0.01;
    export let units = '%';
    export let rangeA = 0;
    export let rangeB = 1;
    export let value = 0.5;
    export let classes = '';
</script>

<div class="range-slider">
    <span class="">{min}{units}</span>
    <div class="slider">
        <input class="min" type="range" {min} {max} {step} value={rangeA} />
        <input class="track" type="range" {min} {max} {step} {value} disabled/>
        <input class="max" type="range" {min} {max} {step} value={rangeB} />
    </div>
    <span class="">{max}{units}</span>
</div>

<style>
    .range-slider {
        display: grid;
        grid-template-columns: 1fr 4fr 1fr;
        align-items: center;
    }
    .slider {
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;
        height: 30px;
        width: 100%;
        padding: 0 0.25rem;
    }

    span {
        color: var(--color-grey-light);
        font-size: var(--text-xs);
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
    }

    .min::-webkit-slider-thumb {
        top: 2px;
    }

    .max::-webkit-slider-thumb {
        top: -2px;
    }

    .min::-moz-range-thumb, .max::-moz-range-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 8px;
        height: 16px;
        background: linear-gradient(to left, var(--color-grey-dark), var(--color-grey-dark) 33%, var(--color-grey-light) 34%, var(--color-grey-light) 66%, var(--color-grey-dark) 66%);
        border-radius: 0;
        cursor: pointer;
        position: relative;
    }

    .min::-moz-range-thumb {
        top: 2px;
    }

    .max::-moz-range-thumb {
        top: -2px;
    }

    .track::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 2px;
        height: 16px;
        border-radius: 0;
        background: var(--color-theme-1);
        cursor: pointer;
    }

    .track::-moz-range-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 14px;
        height: 10px;
        background: var(--color-theme-1);
        cursor: pointer;
    }
</style>