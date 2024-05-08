<script lang="ts">
    import Select from '$lib/components/Forms/Select.svelte'; 
    import Tooltip from '$lib/components/Tooltip/Tooltip.svelte';  
    import { instrumentParameters, fxParameters, globalParameters, paramValues, randomise, keys } from '$lib/stores/parameters';
    import { samples } from '$lib/stores/samples'
    import RangeSlider from '$lib/components/Sliders/RangeSlider.svelte';
    import Socket from '$lib/components/Patching/Socket.svelte';
    import Buttons from '$lib/components/Patching/Buttons.svelte';
    import { loadSample } from '../../../sound';
    import { onMount } from 'svelte';
    // @ts-ignore
    import { FontAwesomeIcon } from 'fontawesome-svelte';
    import { faLock, faShuffle } from '@fortawesome/free-solid-svg-icons';
    
    export let showSockets = true;

    let axesIds = ['x', 'y', 'z'];
    let sampleOptions: {name: string, value: number, active: boolean}[] = [];

    onMount(() => {
        const unsubscribeSamples = samples.subscribe(urls => {
            sampleOptions = urls.map((url, i) => ({name: url.split('/').pop() || '', value: i, active: true}));
        })

        return () => {
            unsubscribeSamples();
        }
    })
</script>

<div class="group">
    <button on:click={() => randomise('inst')}>
        <h2>Instrument</h2>
    </button>
    <button class="connect" on:click={() => randomise('inst')}>
        <FontAwesomeIcon icon={faShuffle} />
    </button>
    {#each $instrumentParameters.filter(({key}) => $keys.includes(key)) 
        as {type, name, min, max, step, units, key, rangeA, rangeB, isLocked} (key)
    }
        <div class="parameter parameter--{type}">

            {#if type === 'select'}
                <div class="samples">
                    <Select 
                        id={key} 
                        options={sampleOptions} 
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
                    id={`param-inst-${key}`}
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

                {#if showSockets}
                    <Socket id={key} type="origin" align="right"/>
                {:else}
                    <Buttons id={key} options={axesIds}/>
                {/if}
            {/if}
        </div>
    {/each}
</div>

<div class="group">
    <button on:click={() => randomise('global')}>
        <h2>Global</h2>
    </button>
    {#each $globalParameters as {name, min, max, step, units, key, rangeA, rangeB, isLocked} (key)}
        <div class="parameter">
            <Tooltip element={key} type="parameter">
                <h3>{name}</h3>
            </Tooltip>
            
            <RangeSlider 
                id={`param-global-${key}`}
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

            {#if showSockets}
                <Socket id={key} type="origin" align="right"/>
            {:else}
                <Buttons id={key} options={axesIds}/>
            {/if}
        </div>
    {/each}
</div>

<div class="group">
    <button on:click={() => randomise('fx')}>
        <h2>Effects</h2>
    </button>

    {#each $fxParameters as {name, min, max, step, units, key, rangeA, rangeB, isLocked} (key)}
        <div class="parameter">
            <Tooltip element={key} type="parameter">
                <h3>{name}</h3>
            </Tooltip>
            <RangeSlider 
                id={`param-fx-${key}`}
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
                        
            {#if showSockets}
                <Socket id={key} type="origin" align="right"/>
            {:else}
                <Buttons id={key} options={axesIds}/>
            {/if}
        </div>
    {/each}
</div>

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
    
    h2 {
        padding-bottom: 0.25rem;
        margin-bottom: 0.5rem;
        border-bottom: 0.5px solid var(--color-grey-light);
        cursor: pointer;
        margin-bottom: 0.75rem;
    }
    
    h2:hover {
        color: var(--color-theme-2);
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

    .group {
        position: relative;
        margin-bottom: 1rem;
        & > button {
            width: 100%;
            text-align: left;
        }

        & .connect {
            position: absolute;
            top: 1.5px;
            right: 1px;
            width: 1rem;
            color: var(--color-yellow);
            opacity: 0.5;
        }
    }

    .group:last-of-type {
        margin-bottom: 0;
    }
</style>