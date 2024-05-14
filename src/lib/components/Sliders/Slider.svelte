<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { tweened, type Tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
    import { onMount } from 'svelte';
    import { clamp, throttle } from "$lib/utils/utils";
    import Learnable from '$lib/components/Learnable/Learnable.svelte';
    
    const dispatch = createEventDispatcher();
    export let id: string = '';
    export let name: string = '';
    export let value: number = 0;
    export let colour: string = '#000';
    export let orientation: string = 'vertical';
    export let disabled: boolean = false;

    let sliderValue: Tweened<number> = tweened(value, {
		duration: 100,
		easing: cubicOut
	});
    
    let slider: HTMLElement;
    let isActive: boolean = false;
    
    function setValue(pageX: number, pageY: number) {
        const { height, width, top, left } = slider?.getBoundingClientRect();
        const position = orientation === 'vertical' ? height : width;
        const offsetY = pageY - (top + window.scrollY)
        const offsetX = pageX - (left + window.scrollX)
        const offset = orientation === 'vertical' ? offsetY : offsetX;
        sliderValue.set(clamp(1 - (position - offset) / position, 0, 1));
    }
    const handleClick = (e: MouseEvent) => {
        if(disabled) return;
        isActive = true;
        const { pageX, pageY } = e;
        setValue(pageX, pageY);
    }
    const handleTouch = (e: TouchEvent) => {
        if(disabled) return;
        isActive = true;
        const { pageX, pageY } = e.touches[0];
        setValue(pageX, pageY);
    }
    const handleMove = (e: MouseEvent) => {
        if(disabled) return;if
        (!isActive) return;
        const { pageX, pageY } = e;
        setValue(pageX, pageY);
    }
    const handleSwipe = (e: TouchEvent) => {
        if(disabled) return;if
        (!isActive) return;
        const { pageX, pageY } = e.touches[0];
        setValue(pageX, pageY);
    }

    onMount(() => {
        const unsubscribesliderValue = sliderValue.subscribe(throttle((v: number) => {
            value = v
            dispatch('change', value);
        }, 25))

        return () => {
            unsubscribesliderValue();
        }
    })
</script>

<div
    class={`slider__container slider__container--${orientation}`}
    class:disabled={disabled}
>
    <Learnable {id}>
        <span 
            class={'label label--' + orientation}
            style={`color: ${colour}`}    
        >{name}</span>
    </Learnable>

    <div class={`slider slider--${orientation}`} 
        on:mousedown={handleClick}
        on:touchstart={handleTouch}
        bind:this={slider}
    >
        <div class="slider__track" style={`background: ${colour}`}></div>
        <div class="slider__thumb" style={`${orientation === 'vertical' ? 'top' : 'left'}: calc(${value * 100}% - 4px)`}></div>
    </div>
</div>

<svelte:window 
    on:mousemove={handleMove} 
    on:touchmove={handleSwipe}
    on:mouseup={() => isActive = false} 
    on:touchend={() => isActive = false}
/>

<style lang="scss">
    .disabled {
        opacity: 0.5;
        & .slider {
            cursor: not-allowed;
        }
    }
    .slider__container {
        touch-action: none;
        display: flex;
        align-items: center;
        justify-content: center;
        &--vertical { 
            flex-direction: column;
            width: 1.25rem;
            height: 100%;

            .label {
                font-size: var(--text-base);
            }
        }
        &--horizontal { 
            flex-direction: row;
            height: 1.25rem;
            width: 100%;
            .label {
                min-width: 40px;
            }
        }
    }
    .slider {
        display: flex;
        position: relative;
        width: 100%;
        height: 100%;
        cursor: pointer;
        &--vertical {
            justify-content: center;
            

            .slider__track {
                width: 2px;
                height: 100%;
            }
            .slider__thumb {
                width: 100%;
                height: 8px;
                background: linear-gradient(to bottom, #000, #000 35%, var(--color-grey-light) 35%, var(--color-grey-light) 65%, #000 65%);
            }
        }
        &--horizontal {
            align-items: center;
            .slider__track {
                width: 100%;
                height: 2px;
            }
            .slider__thumb {
                width: 8px;
                height: 100%;
                background: linear-gradient(to right, #000, #000 35%, var(--color-grey-light) 35%, var(--color-grey-light) 65%, #000 65%);
            }
        }
        &__thumb {
            position: absolute;
            top: 0;
            left: 0rem;
            
            border-radius: 0;
            cursor: pointer;
            box-shadow: 2px 3px 5px 1px var(--color-box-shadow);
        }
    }

    .label {
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-grey-light);
        font-size: var(--text-xs);
        min-width: 1rem;
        z-index: 10;
        &--vertical {
            width: 100%;
            height: auto;
            margin-bottom: 0.5rem;
            text-align: center;
        }
        &--horizontal {
            width: auto;
            height: 100%;
            margin-right: 0.5rem;
            text-align: left;
        }
    }
</style>