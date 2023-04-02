<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { Meter } from 'tone';
    import type { Gain } from 'tone';

    export let node: Gain;
    const range = (start: number, end: number) => {
        return Array(end - start + 1).fill(undefined).map((_, i) => start + i);
    };
    const bars: number[] = range(-50, 0);
    
    let gainL: number = -50;
    let gainR: number = -50;
    let intervalId = 0;
    const meter = new Meter({
        channels: 2,
        smoothing: 0.8,
    });
    node && node.connect(meter);

    onMount(() => {
        intervalId = setInterval(() => {
            gainL = meter.getValue()[0];
            gainR = meter.getValue()[1];
        }, 100);
    })

    onDestroy(() => {
        clearInterval(intervalId);
    })
</script>

<div class="meter">
    <div class="meter__bars">
        {#each bars as bar}
            <div 
                class="meter__bar"
            >
                <span class:active={gainL >= bar}></span>
                <span class:active={gainR >= bar}></span>
            </div>
        {/each}
    </div>
    <div class="meter__labels">
        {#each bars as bar}
            {#if !(bar%10)}
                <span>{bar}</span>
            {/if}
        {/each}
    </div>
</div>

<style lang="scss">
    .meter {
        &__bars {
            width: 100%;
            display: flex;
            justify-content: space-between;
            height: 3rem;
        }

        &__bar {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            span {
                border: 0.5px solid var(--color-grey-dark);
                background-color: var(--color-grey-mid);
                height: 100%;
                &.active {
                    background-color: var(--color-yellow    );
                }
            }
        }

        &__labels {
            display: flex;
            justify-content: space-between;
            padding: 0.25rem 0;
            span {
                font-size: var(--text-xs);
                color: var(--color-grey-mid);
            }
        }
    }
</style>