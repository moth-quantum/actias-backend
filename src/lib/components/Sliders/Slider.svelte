<script lang="ts">
    import { tweened, type Tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
    import { onMount } from 'svelte';
    import debounce from 'lodash.debounce';
    export let name: string = '';
    export let value: number = 0;
    export let colour: string = '#000';
    export let orientation: string = 'vertical';

    let sliderValue: Tweened<number> = tweened(0, {
		duration: 400,
		easing: cubicOut
	});
    
    let slider: HTMLElement;
    let isActive: boolean = false;
    
    function setValue(pageY: number) {
        const { height } = slider?.getBoundingClientRect();
        const offsetY = pageY - (slider.getBoundingClientRect().top + window.scrollY)
        sliderValue.set(1 - (height - offsetY) / height);
    }
    const handleMove = (e: MouseEvent) => {
        if(!isActive) return;
        setValue(e.pageY);

    }
    const handleClick = (e: MouseEvent) => {
        isActive = true;
        setValue(e.pageY);
    }

    onMount(() => sliderValue.subscribe(debounce((v: number) => value = v, 10)))
</script>

<div class="slider__container">
    <span 
        class={'label label--' + orientation}
        style={`color: ${colour}`}    
    >{name}</span>


    <div class="slider" 
        on:mousedown={handleClick}
        on:mouseup={() => isActive = false}
        bind:this={slider}
    >
        <div class="slider__track" style={`background: ${colour}`}></div>
        <div class="slider__thumb" style={`top: calc(${$sliderValue * 100}% - 4px)`}></div>
    </div>
</div>

<svelte:window on:mousemove={handleMove} />

<style lang="scss">

    .slider__container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 1.25rem;
    }
    .slider {
        display: flex;
        justify-content: center;
        position: relative;
        width: 100%;
        height: 100%;
        width: 1.25rem;
        cursor: pointer;
        &__track {
            width: 2px;
            height: 100%;
            background-color: blue;
        }
        &__thumb {
            position: absolute;
            top: 0;
            left: 0rem;
            width: 100%;
            height: 8px;
            background: linear-gradient(to bottom, #000, #000 35%, var(--color-grey-light) 35%, var(--color-grey-light) 65%, #000 65%);
            border-radius: 0;
            cursor: pointer;
            box-shadow: 2px 3px 5px 1px var(--color-box-shadow);
        }
    }

    .label {
        color: var(--color-grey-light);
        font-size: var(--text-base);
        text-align: center;
        margin-bottom: 0.5rem;
        width: 100%;
    }

    input {
        display: none;
    }
</style>