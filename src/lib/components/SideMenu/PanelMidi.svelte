<script lang="ts">
    import { get } from 'svelte/store';
    import { activateInput, deactivateInput, inputs, activeInputs } from '$lib/stores/midi';
    import Select from '$lib/components/Forms/Select.svelte';
    import Counter from '$lib/components/Forms/Counter.svelte';

    const handleAddDevice = () => {
        const firstInactiveIndex = get(inputs).find(input => !input.active);
        firstInactiveIndex && activateInput(firstInactiveIndex.name);
    }

    const handleOnChangeDevice = (prev: string, next: string) => {
        deactivateInput(prev);
        activateInput(next);
    }

    const handleOnChangeChannel = (device: string, channel: number) => {
        inputs.update(inputs => inputs.map(input => input.name === device 
            ? { ...input, channel } 
            : input
        ));
    }
</script>

<section>
    <h2>Midi Config</h2>
    <div class="group devices">
        <div class="headings">
            <h3 class="title">Devices</h3>
            <h3 class="title">Channel</h3>
        </div>
        {#each $inputs as {name, channel}}
            {#if $activeInputs.includes(name)}
                <div class="device">
                    <Select 
                        id="device" 
                        options={$inputs.map(input => ({name: input.name, active: true}))}
                        selected={name}
                        onChange={(e) => handleOnChangeDevice(name, e.target?.value)} 
                        uppercase={false}
                    />
                    <Counter 
                        value={channel}
                        on:change={e => handleOnChangeChannel(name, e.detail.value)}
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
    <div class="group learn">
        <h3 class="title">Midi Learn</h3>
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

        
    }
</style>
