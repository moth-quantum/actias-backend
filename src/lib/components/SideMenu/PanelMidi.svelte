<script lang="ts">    
    import { get } from 'svelte/store';
    import { activateInput, deactivateInput, inputs, activeInputs } from '$lib/stores/midi';
    import { actions } from '$lib/stores/midi';
    import Select from '$lib/components/Forms/Select.svelte';
    import Counter from '$lib/components/Forms/Counter.svelte';
    // @ts-ignore
    import { FontAwesomeIcon } from 'fontawesome-svelte';
    import { faMinus } from '@fortawesome/free-solid-svg-icons';

    const handleAddDevice = () => {
        const firstInactiveIndex = get(inputs).find(input => !input.active);
        firstInactiveIndex && activateInput(firstInactiveIndex.name);
    }

    const handleOnChangeDevice = (e: Event, prev: string) => {
        const target = e.target as HTMLButtonElement;
        const next = target.value
        deactivateInput(prev);
        activateInput(next);
    }

    const handleOnChangeChannel = (channel: number, device: string) => {
        inputs.update(inputs => inputs.map(input => input.name === device 
            ? { ...input, channel } 
            : input
        ));
    }

    const handleRemoveDevice = (device: string) => {
        deactivateInput(device);
    }
</script>

<section>
    <div class="group devices">
        <div class="headings">
            <h3 class="title">Devices</h3>
            <h3 class="title">Channel</h3>
        </div>
        {#each $inputs as {name, channel}}
            {#if $activeInputs.includes(name)}
                <div class="device">
                    <button on:click={() => handleRemoveDevice(name)} class="device__remove">
                        <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <Select 
                        id="device" 
                        options={$inputs.map(input => ({name: input.name, value: input.name, active: true}))}
                        selected={name}
                        onChange={(e) => handleOnChangeDevice(e, name)} 
                        uppercase={false}
                    />
                    <Counter 
                        value={channel}
                        on:change={e => handleOnChangeChannel(e.detail.value, name)}
                    />
                </div>
            {/if}
        {/each}
        
        {#if $inputs.some(input => !input.active)}
        <div class="device">
            <button 
                class="add-device"
                on:click={handleAddDevice}
            >
                Add device
                <span class="add-device__icon">+</span>
            </button>

        </div>
        {/if}
    </div>
    <div class="group map">
        <h3 class="title">Midi Map</h3>
        <ul class="map__list">
            {#each Object.entries($actions) as [i, {label}]}
                <li>cc{i}: {label}</li>
            {/each}
        </ul>
    </div>
</section>

<style lang="scss">
    section {
        display: flex;
        flex-direction: column;

        & h2 {
            text-align: center;
            font-size: var(--text-sm);
            padding: 4px 0 calc(2rem + 4px);
            color: white;
        }

        & h3 {
            color: white;
            
        }

        .devices {
            & h3 {
                border-bottom: none;
                margin-bottom: 0;
            }
        }

        .headings {
            border-bottom: 0.5px solid var(--color-grey-light);
            margin-bottom: 1.5rem;
        }
        .device, .headings {
            display: grid;
            grid-template-columns: 4fr 1fr;
            gap: 1rem;
        }

        .device {
            margin-bottom: 0.75rem;
            position: relative;

            &__remove {
                position: absolute;
                top: 0.5rem;
                left: -1rem;
                font-size: var(--text-sm);
            }
        }

        .add-device {
            display: flex;
            justify-content: space-between;
            font-size: var(--text-sm);
            color: white;
            padding: calc(0.125rem + 3px) 0.75rem;
            width: 100%;
            border-radius: 5px;
            text-align: left;
            border: 1px dotted white;
        }

        & .group {
            margin-bottom: 2rem;            
        }

        .map {
            &__list {
                list-style: none;
                padding: 0;
                margin: 0;
                font-size: var(--text-sm);

                & li {
                    text-transform: capitalize;
                }
            }
        }
    }
</style>
