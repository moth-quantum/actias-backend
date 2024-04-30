<script lang="ts">
    import { envelopes } from '$lib/stores/envelopes';
    import { volume } from '$lib/stores/global';
    import { drone } from '$lib/stores/parameters';
    import { buttonTooltips, knobTooltips } from '$lib/stores/tooltips';
    import Knob from '$lib/components/Knob/Knob.svelte';
    import Keyboard from '$lib/components/Keyboard/Keyboard.svelte';
    import Button from '$lib/components/Button/Button.svelte';
    import { library } from '@fortawesome/fontawesome-svg-core';
    import { faSignal, faCircle } from '@fortawesome/free-solid-svg-icons';
    import Tooltip from '../Tooltip/Tooltip.svelte';

    library.add(faSignal, faCircle);
    
    export let tooltips: boolean = false;
    let hoveredEl: string | null = null;
</script>

<div class="controls">
    <h2 class="visually-hidden">Controls</h2>
    
    <div class="buttons" on:mouseenter={() => hoveredEl = 'drone'}
        on:mouseleave={() => hoveredEl = null}>
        {#if tooltips}
            <div class="tooltip--parent">
                <Tooltip 
                    classes="tooltip--drone {hoveredEl === 'drone' ? 'tooltip--show' : ''}" 
                    element='drone' 
                    message={$buttonTooltips.find(tooltip => tooltip.element.toLowerCase() === 'drone')?.message || ''} 
                />
                <Button 
                    orientation="vertical" 
                    text="Drone" 
                    colour="grey" 
                    active={$drone} 
                    onClick={() => drone.update(d => !d)} 
                    icon={faSignal} 
                />
            </div>
        {:else}
            <Button orientation="vertical" text="Drone" colour="grey" active={$drone} onClick={() => drone.update(d => !d)} icon={faSignal} />
        {/if}
    </div>
    <div class="controller">
        <div class="keys">
            <Keyboard />
        </div>
        <div class="knobs">
            <div class="knobs__title knobs__title--volume">
                <h3>Vol</h3>
            </div>
            <div class="knobs__knob knobs__knob--vol">
                {#if tooltips}
                <div class="tooltip--parent-knob">
                    <Tooltip 
                        classes="tooltip--knob {hoveredEl === 'vol' ? 'tooltip--show' : ''}" 
                        element='Vol' 
                        message={$knobTooltips.find(tooltip => tooltip.element.toLowerCase() === 'vol')?.message || ''} 
                    />
                    <div on:mouseenter={() => hoveredEl = 'vol'}
                        on:mouseleave={() => hoveredEl = null}>
                        <Knob name="Vol" pixelRange={200} bind:value={$volume}/>
                    </div>
                </div>
                {:else}
                    <Knob name="Vol" pixelRange={200} bind:value={$volume}/>
                {/if}
            </div>
            {#each $envelopes as {name, a, d, s, r}, i (name)}
                <div class="knobs__title knobs__title--envelope__{i}">
                    <h3>{name}</h3>
                </div>
                <div class="knobs__knob knobs__knob--{`${name}_a`}">
                    {#if tooltips}
                    <div class="tooltip--parent-knob" on:mouseenter={() => hoveredEl = `${name}_a`}
                        on:mouseleave={() => hoveredEl = null}>
                        <Tooltip 
                            classes="tooltip--knob {hoveredEl === `${name}_a` ? 'tooltip--show' : ''}" 
                            element={`${name}_a`} 
                            message={$knobTooltips.find(tooltip => tooltip.element.toLowerCase() === `${name}_a`.toLowerCase())?.message || ''} 
                        />
                        <Knob bind:value={a} pixelRange={200} min={0.01} name="a"/>
                    </div>
                    {:else}
                        <Knob bind:value={a} pixelRange={200} min={0.01} name="a"/>
                    {/if}
                </div>
                <div class="knobs__knob knobs__knob--{`${name}_d`}">
                    <Knob bind:value={d} pixelRange={200} min={0.01} name="d"/>
                </div>
                <div class="knobs__knob knobs__knob--{`${name}_s`}">
                    <Knob bind:value={s} pixelRange={200} min={0.01} name="s"/>
                </div>
                <div class="knobs__knob knobs__knob--{`${name}_r`}">
                    <Knob bind:value={r} pixelRange={200} min={0.01} name="r"/>
                </div>
            {/each}
        </div>
    </div>
</div>
        
<style lang="scss">
    .sidebar {
        &__title {
            margin-bottom: 1.25rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--color-yellow);
        }
        &__input {
            margin-bottom: 0.5rem;
            display: flex;
            justify-content: space-between;
        }
        &__close {
            cursor: pointer;
            fill: var(--color-grey-darkest)
        }
    }
    .controls {
        display: flex;
        padding: 1rem;
        
        @media (min-width: 1200px) {
            padding: 1rem 2rem;
        }
        height: 100%;
        min-height: 13rem;
    }

    .buttons {
        display: flex;
        flex-direction: column;
        margin-right: 1rem;
        @media (min-width: 400px) {
            width: 8rem;
        }
        @media (min-width: 650px) {
            width: 10rem;
        }
        @media (min-width: 1200px) {
            width: 4.5rem;
        }
    }

    .controller {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .keys {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 1rem;
        height: 100%;
    }

    .knobs {
        display: grid;
        grid-template-columns: 0.5fr 1fr 0.5fr 1fr 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        grid-gap: 0.5rem;
        justify-content: space-between;

        width: 100%;
        background: linear-gradient(var(--color-grey-dark), #454545, var(--color-grey-dark));

        @media (min-width: 700px) {
            display: flex;
        }
        
        @media (min-width: 1200px) {
            display: grid;
        }
        @media (min-width: 1400px) {
            display: flex;
        }

        &__title {
            height: 100%;
            display: flex;
            align-items: center;
            border-left: 1px solid var(--color-grey-light);
            padding: 0 0 0 0.5rem;
            & h3 {
                writing-mode: vertical-rl;
                text-orientation: sideways;
                color: var(--color-grey-light);
                transform: rotate(180deg);
                font-size: var(--text-sm);
            }

            &--volume {
                grid-column: 1 / span 1;
                grid-row: 1 / span 2;
            }

            &--envelope__0 {
                grid-column: 3 / span 1;
                grid-row: 1 / span 1;
            }

            &--envelope__1 {
                grid-column: 3 / span 1;
                grid-row: 2 / span 1;
            }
        } 

        &__knob {
            display: flex;
            align-items: center;
            justify-content: center;
            &--vol {
                grid-column: 2 / span 1;
                grid-row: 1 / span 2;
            }
            
            &--Amp_a {
                grid-column: 4 / span 1;
                grid-row: 1 / span 1;
            }

            &--Amp_d {
                grid-column: 5 / span 1;
                grid-row: 1 / span 1;
            }

            &--Amp_s {
                grid-column: 6 / span 1;
                grid-row: 1 / span 1;
            }

            &--Amp_r {
                grid-column: 7 / span 1;
                grid-row: 1 / span 1;
            }

            &--Filter_a, &--Mod_a {
                grid-column: 4 / span 1;
                grid-row: 2 / span 1;
            }

            &--Filter_d, &--Mod_d {
                grid-column: 5 / span 1;
                grid-row: 2 / span 1;
            }

            &--Filter_s, &--Mod_s {
                grid-column: 6 / span 1;
                grid-row: 2 / span 1;
            }

            &--Filter_r, &--Mod_r {
                grid-column: 7 / span 1;
                grid-row: 2 / span 1;
            }
        }
    }

    .tooltip--parent {
        position: relative;
        height: 100%;
        cursor: pointer;
        &:hover {
            border-radius: 5px;
            box-shadow: 0 0 8px 8px rgba(7,157,147, 0.9);
            transition: all 0.3s;
        }
        & > button {
            height: 100%;
        }
    }
</style>