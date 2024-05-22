<script lang="ts">
    import type { Parameter } from "$lib/types";
    import type { Writable } from "svelte/store";
    import { paramValues, keys } from '$lib/stores/parameters';
    import Select from '$lib/components/Forms/Select.svelte'; 
    import Tooltip from '$lib/components/Tooltip/Tooltip.svelte';  
    import RangeSlider from '$lib/components/Sliders/RangeSlider.svelte';
    import { loadSample } from '../../../sound';
    // @ts-ignore
    import { FontAwesomeIcon } from 'fontawesome-svelte';
    import { faLock } from '@fortawesome/free-solid-svg-icons';
    import Socket from '$lib/components/Patching/Socket.svelte';
    import Buttons from '$lib/components/Patching/Buttons.svelte';

    export let group: string;
    export let parameters: Writable<Parameter[]>;
    export let selectOptions: {name: string, value: number, active: boolean}[] = [];
</script>



{#each $parameters.filter(({key}) => group !== 'inst' || $keys.includes(key)) 
    as {type, name, min, max, step, units, key, rangeA, rangeB, isLocked} (key)
}
    <div class="parameter parameter--{type}">

        {#if type === 'select'}
            <div class="samples">
                <Select 
                    id={key} 
                    options={selectOptions} 
                    selected={$paramValues[key]}
                    onChange={e => {
                        // @ts-ignore
                        const i = +e.target.value;
                        rangeA = rangeB = (i || 0)
                        loadSample(i)
                    }}
                />
            </div>
        {/if}
        {#if type === 'range'}
            <Tooltip element={key} type="parameter">
                <h3>{name}</h3>
            </Tooltip>
            
            <RangeSlider 
                id={`param-${type}-${key}`}
                {min} {max} {step} {units} 
                value={$paramValues[key]}
                bind:rangeA={rangeA} 
                bind:rangeB={rangeB} 
            />

            <button class="lock" on:click={() => isLocked = !isLocked}>
                <FontAwesomeIcon icon={faLock}
                    class="icon" 
                    style={`color: ${isLocked ? '#FFF' : 'var(--color-grey-darker);'}`}
                />
            </button>

            <!-- TODO: hide sockets on mobile -->
            {#if true}
                <Socket id={key} type="origin" align="right"/>
            {:else}
                <Buttons id={key} options={['x', 'y', 'z']}/>
            {/if}
        {/if}
    </div>
{/each}

<style lang="scss">
    .samples { 
        grid-column: 1 / 3;
        margin-bottom: 0.5rem;
    }
    .parameter {
        display: grid;
        grid-template-columns: 3fr 7fr 1fr 3fr;
        @media (min-width: 1200px) {
            grid-template-columns: 3fr 9fr 1fr 1fr;
        }
        margin-bottom: 0.4rem;

        &--select {
            grid-template-columns: 2fr 10fr;
        }
    }

    .parameter:nth-child(1) {
        grid-column: 1;
    }
    
    h3 {
        display: flex;
        align-items: center;
        word-break: break-word;
        word-spacing: 50000px; 
    }

    .lock {
        font-size: 0.6rem;
    }

    .parameter:nth-child(2) {
        grid-column: 2;
    }

    .parameter:nth-child(3) {
        grid-column: 3;
    }

    .parameter:nth-child(4) {
        grid-column: 4;
    }

    .parameter:last-of-type {
        margin-bottom: 0;
    }
</style>