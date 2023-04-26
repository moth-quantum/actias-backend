<script lang="ts">
    import { tweened, type Tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
    import { onMount } from 'svelte';
    import { clamp } from "$lib/utils/utils";
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
        sliderValue.set(clamp(1 - (height - offsetY) / height, 0, 1));
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

<div class={`slider__container slider__container--${orientation}`}>
    <span 
        class={'label label--' + orientation}
        style={`color: ${colour}`}    
    >{name}</span>

    <div class={`slider slider--${orientation}`} 
        on:mousedown={handleClick}
        on:mouseup={() => isActive = false}
        bind:this={slider}
    >
        <div class="slider__track" style={`background: ${colour}`}></div>
        <div class="slider__thumb" style={`${orientation === 'vertical' ? 'top' : 'left'}: calc(${$sliderValue * 100}% - 4px)`}></div>
    </div>
</div>

<svelte:window on:mousemove={handleMove} />

<style lang="scss">

    .slider__container {
        display: flex;
        align-items: center;
        justify-content: center;
        &--vertical { 
            flex-direction: column;
            width: 1.25rem;
            height: 100%;
        }
        &--horizontal { 
            flex-direction: row;
            height: 1.25rem;
            width: 100%;
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
        font-size: var(--text-base);
        min-width: 1rem;
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

    input {
        display: none;
    }
</style>