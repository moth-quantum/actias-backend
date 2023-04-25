<script lang="ts">
    import { instrument, instruments } from '$lib/stores/parameters';
    import Button from '$lib/components/Button/Button.svelte';

    import { library } from '@fortawesome/fontawesome-svg-core';
    import { faSmileWink, faNetworkWired, faCompactDisc, faBraille } from '@fortawesome/free-solid-svg-icons';
    library.add(faSmileWink, faNetworkWired, faCompactDisc, faBraille);

    const icons = {
        'synth': faNetworkWired,
        'sampler': faCompactDisc,
        'granular': faBraille
    }

    export let orientation: 'horizontal' | 'vertical' = 'horizontal';
</script>

<div class={`instrument-buttons instrument-buttons--${orientation}`}>
    {#each instruments as inst} 
        <Button 
            onClick={() => instrument.set(inst)} 
            active={$instrument === inst} 
            disabled={$instrument !== inst}
            colour="yellow" 
            text={inst} 
            icon={icons[inst]}
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
