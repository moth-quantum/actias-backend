<script lang="ts">
    export let min: number = 0;
    export let max: number = 1;
    export let step: number = 0.01;
    export let name: string = '';
    export let value: number = 0.5;
    export let colour: string = '#000';
    export let orientation: string = 'vertical';
    
    let isActive: boolean = false;
    const handleMove = (e: MouseEvent) => {
        console.log(e)
        // if (isActive) {
        //     const { height } = e.target?.getBoundingClientRect();
        //     value = 1 - (height - e.offsetY) / height;
        // }
    }
    const handleClick = (e: MouseEvent) => {
        isActive = true;
        const { height } = e.target?.getBoundingClientRect();
        value = 1 - (height - e.offsetY) / height;
    }
</script>

<div class="slider__container">
    <span 
        class={'label label--' + orientation}
        style={`color: ${colour}`}    
    >{name}</span>


    <div class="slider" 
        on:mousedown={handleClick}
        on:mouseup={() => isActive = false}
        on:mouseleave={() => isActive = false}
    >
        
        <div class="slider__track" style={`background: ${colour}`}></div>
        <div 
            class="slider__thumb" style={`top: ${value * 100}%`}
            on:mousemove={handleMove}
        ></div>
    </div>
</div>

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
        width: 16px;
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