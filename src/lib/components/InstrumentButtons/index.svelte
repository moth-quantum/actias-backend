<script lang="ts">
    import { instrument, instruments } from '$lib/stores/parameters';
    import Button from '$lib/components/Button/Button.svelte';

    import { library } from '@fortawesome/fontawesome-svg-core';
    import { faSmileWink, faNetworkWired, faCompactDisc, faBraille, faTable, faWaveSquare } from '@fortawesome/free-solid-svg-icons';
    library.add(faSmileWink, faNetworkWired, faCompactDisc, faBraille, faTable);

    const icons = {
        'demo': faWaveSquare,
        'synth': faNetworkWired,
        'sampler': faCompactDisc,
        'granular': faBraille,
        'wavetable': faTable,
    }

    export let orientation: 'horizontal' | 'vertical' = 'horizontal';
</script>

<div class={`instrument-buttons instrument-buttons--${orientation}`}>
    {#each instruments as {name}}
        <Button 
            onClick={() => instrument.set(name)} 
            active={$instrument === name} 
            disabled={$instrument !== name}
            colour="yellow" 
            text={name} 
            icon={icons[name]}
            classes={orientation === 'horizontal' ? 'mr-2' : 'mb-2'}
        />
    {/each}
</div>

<style lang="scss">
    .instrument-buttons {
        display: flex;
        height: 100%;

        &--horizontal {
            flex-direction: row;
        }

        &--vertical {
            flex-direction: column;
        }
    }


</style>
