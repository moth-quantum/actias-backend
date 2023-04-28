<script>
    import { envelopes } from '$lib/stores/envelopes';
    import { volume } from '$lib/stores/global';
    import { drone } from '$lib/stores/parameters';
    import { inputs } from '$lib/stores/midi';
    import { Drawer } from 'flowbite-svelte';
    import { sineIn } from 'svelte/easing';
    import Knob from '$lib/components/Knob/Knob.svelte';
    import Keyboard from '$lib/components/Keyboard/Keyboard.svelte';
    import Button from '$lib/components/Button/ButtonLarge.svelte';
    import Checkbox from '$lib/components/Forms/Checkbox.svelte';

    import { library } from '@fortawesome/fontawesome-svg-core';
    import { faSignal, faCircle } from '@fortawesome/free-solid-svg-icons';
    library.add(faSignal, faCircle);

    let sidebarIsHidden = true; 
    let transitionParams = {
        x: -320,
        duration: 200,
        easing: sineIn
    };
    
</script>

<div class="controls">
    <h2 class="visually-hidden">Controls</h2>

    <Drawer 
        transitionType="fly" {transitionParams} 
        bind:hidden={sidebarIsHidden} 
        id='sidebar'
    >
        <div class="sidebar">
            <button on:click={() => (sidebarIsHidden = true)}>
                <svg class="sidebar__close w-5 h-5 mb-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </button>
            <h2 class="sidebar__title">Midi Input Devices</h2>
            <div class="sidebar__inputs">
                {#each $inputs as {name, active}, i (name)}
                    <div class="sidebar__input">
                        <h3>{name}</h3>
                        <Checkbox checked={active} onChange={(checked) => {
                            inputs.update(inputs => {
                                inputs[i].active = checked || false;
                                return inputs;
                            })
                        }} />
                    </div>
                {/each}
        </div>
    </Drawer>
    
    <div class="buttons">
        <Button text="Midi" colour="primary" onClick={() => (sidebarIsHidden = false)} icon={faCircle} />
        <Button text="Drone" colour="secondary" active={$drone} onClick={() => drone.update(d => !d)} icon={faSignal} />
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
                <Knob name="Vol" pixelRange={200} bind:value={$volume}/>
            </div>
            {#each $envelopes as {name, a, d, s, r}, i (name)}
                <div class="knobs__title knobs__title--envelope__{i}">
                    <h3>{name}</h3>
                </div>
                <div class="knobs__knob knobs__knob--{`${name}_a`}">
                    <Knob bind:value={a} pixelRange={200} min={0.01} name="a"/>
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
        overflow-x: scroll;
        @media (min-width: 1200px) {
            padding: 1rem 2rem;
        }
        height: 100%;
        min-height: 14rem;
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
</style>