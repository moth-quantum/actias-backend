<script lang="ts">
    import Tooltip from '$lib/components/Tooltip/Tooltip.svelte';  
    import { instrument, instrumentParameters, fxParameters, globalParameters, randomise, demoParameters, clearConnections, randomiseConnections } from '$lib/stores/parameters';
    import { samples } from '$lib/stores/samples'
    import { onMount } from 'svelte';
    import { connections } from '$lib/stores/patching';
    // @ts-ignore
    import { FontAwesomeIcon } from 'fontawesome-svelte';
    import { faShuffle, faTrash } from '@fortawesome/free-solid-svg-icons';
    import ParameterGroup from './ParameterGroup.svelte';

    let sampleOptions: {name: string, value: number, active: boolean}[] = [];

    onMount(() => {
        const unsubscribeSamples = samples.subscribe(urls => {
            sampleOptions = urls.map((url, i) => ({name: url.split('/').pop() || '', value: i, active: true}));
        })

        return () => unsubscribeSamples();
    })
</script>

{#if $instrument === 'demo'}
    <div class="group">
        <button on:click={() => randomise('demo')}>
            <Tooltip element="demo-parameters" fullHeight={false}>
                <h2>Parameters</h2>
            </Tooltip>
            <button class="connect" on:click={(e) => {
                e.stopPropagation()
                $connections.length 
                    ? clearConnections()
                    : randomiseConnections()
            }}>
                <Tooltip 
                    element={$connections.length ? 'clear-patching' : 'randomise-patching'} 
                    classes="flex items-center"
                    type="parameter"
                >
                    <FontAwesomeIcon icon={$connections.length ? faTrash : faShuffle } />
                </Tooltip>
            </button>
        </button>
        <ParameterGroup 
            group="demo"
            parameters={demoParameters} 
        />
    </div>
{:else}
    <div class="group">
        <button on:click={() => randomise('inst')}>
            <Tooltip element="instrument-parameters" fullHeight={false}>
                <h2>Instrument</h2>
            </Tooltip>
            <button class="connect" on:click={(e) => {
                e.stopPropagation()
                $connections.length 
                    ? connections.set([])
                    : randomiseConnections()
            }}>
                <Tooltip element="randomise-patching" type="parameter" fullHeight={false}>
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
            <Tooltip element="global-parameters" fullHeight={false}>
                <h2>Global</h2>
            </Tooltip>
        </button>
        <ParameterGroup 
            group="global"
            parameters={globalParameters} 
        />
    </div>

    <div class="group">
        <button on:click={() => randomise('fx')}>
            <Tooltip element="fx-parameters" fullHeight={false}>
                <h2>Effects</h2>
            </Tooltip>
        </button>

        <ParameterGroup 
            group="fx"
            parameters={fxParameters}
        />
    </div>
{/if}

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
        & button {
            width: 100%;
            text-align: left;
            position: relative;
        }

        & .connect {
            position: absolute;
            top: 0px;
            right: 1px;
            width: 1rem;
            color: var(--color-yellow);
            z-index: 100;
            font-size: 0.75rem;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 18px;
        }
    }

    .group:last-of-type {
        margin-bottom: 0;
    }
</style>