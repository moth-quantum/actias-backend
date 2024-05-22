<script lang="ts">
    import Tooltip from '$lib/components/Tooltip/Tooltip.svelte';  
    import { instrumentParameters, fxParameters, globalParameters, randomise, demoParameters } from '$lib/stores/parameters';
    import { samples } from '$lib/stores/samples'
    import { onMount } from 'svelte';
    import { randomiseConnections, connections } from '$lib/stores/patching';
    // @ts-ignore
    import { FontAwesomeIcon } from 'fontawesome-svelte';
    import { faShuffle, faTrash } from '@fortawesome/free-solid-svg-icons';
    import ParameterGroup from './ParameterGroup.svelte';

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
        <button class="connect" on:click={(e) => {
            e.stopPropagation()
            $connections.length 
                ? connections.set([])
                : randomiseConnections()
        }}>
            <Tooltip element="randomise-patching" type="parameter">
                <FontAwesomeIcon icon={$connections.length ? faTrash : faShuffle } />
            </Tooltip>
            </button>
    </button>
    <ParameterGroup 
        group="inst"
        parameters={instrumentParameters}  
        selectOptions={sampleOptions} 
    />
</div>

<div class="group">
    <button on:click={() => randomise('global')}>
        <h2>Global</h2>
    </button>
    <ParameterGroup 
        group="global"
        parameters={globalParameters} 
    />
</div>

<div class="group">
    <button on:click={() => randomise('fx')}>
        <h2>Effects</h2>
    </button>

    <ParameterGroup 
        group="fx"
        parameters={fxParameters}
    />
</div>

<style lang="scss">
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
    
    .group {
        margin-bottom: 1rem;
        & > button {
            width: 100%;
            text-align: left;
            position: relative;
        }

        & .connect {
            position: absolute;
            top: 0px;
            right: 2px;
            width: 1rem;
            color: var(--color-yellow);
            z-index: 100;
            font-size: 0.75rem;
        }
    }

    .group:last-of-type {
        margin-bottom: 0;
    }
</style>