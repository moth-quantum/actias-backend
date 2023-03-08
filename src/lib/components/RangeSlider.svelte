<script>
    let min = 0;
    let max = 1;
    export let value = 0.5;
    export let classes = '';
</script>

<div class={"range-slider " + classes}>
    <input class="min" type="range" min={0} max={1.0} step="any" value={min} />
    <input class="track" type="range" min={0} max={1.0} step="any" {value} disabled/>
    <input class="max" type="range" min={0} max={1.0} step="any" value={max} />
</div>

<style>
    .range-slider {
        display: flex;
        flex-direction: column;
        position: relative;
        height: 30px;
        width: 100%;
    }

    input[type=range] {
        width: 100%;
        -webkit-appearance: none;  /* Override default CSS styles */
        appearance: none;
        background: transparent;  /* Otherwise white in Chrome */
        outline: none; 
        margin: 0;
        height: 10px;
    }

    input[type=range].track {
        background: lightgrey;
    }
    
    /* Annoyingly, lots of repeated css, but doesn't work otherwise */
    .min::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 4px;
        height: 20px;
        background: var(--color-theme-1);
        cursor: pointer;
        position: relative;
        top: 10px;
    }

    .max::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 4px;
        height: 20px;
        background: var(--color-theme-1);
        cursor: pointer;
        position: relative;
        top: -10px;
    }

    .min::-moz-range-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 4px;
        height: 20px;
        background: var(--color-theme-1);
        cursor: pointer;
        position: relative;
        top: 10px;
    }

    .max::-moz-range-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 4px;
        height: 20px;
        background: var(--color-theme-1);
        cursor: pointer;
        position: relative;
        top: -10px;
    }

    .track::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 14px;
        height: 10px;
        background: var(--color-theme-1);
        cursor: pointer;
    }

</style>