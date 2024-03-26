<script lang="ts">
    import Dialog from '$lib/components/Dialog/Dialog.svelte';
    import Save from '$lib/components/Dialog/Save.svelte';
    import Select from '$lib/components/Forms/Select.svelte';
    import Button from '$lib/components/Button/Button.svelte';
    import Input from '$lib/components/Forms/Input.svelte';
    import { presetKeys, presets, savePreset, activePreset as active } from '$lib/stores/presets';
    import { FontAwesomeIcon } from 'fontawesome-svelte';
    import { library } from '@fortawesome/fontawesome-svg-core';
    import { faChevronLeft, faChevronRight, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
    import { onMount, onDestroy } from 'svelte';
    
    library.add(faChevronLeft, faChevronRight, faFloppyDisk);

    export let hidden = false;
    let current = $active
    let save: HTMLDialogElement;
    let showEdit = false;
    let editName = '';

    const handleNameChange = (e: Event) => {
        // @ts-ignore
        const name = e.target?.value
        if(!name) return

        presets.update(presets => {
            const newPresets = {...presets}
            newPresets[name] = newPresets[current]
            delete newPresets[current]
            current = $active    
            return newPresets
        })
    }

    const onShowDialog = () => save?.showModal();
        
    onMount(() => document.addEventListener('showSavePresetDialog', onShowDialog));
    onDestroy(() => document.removeEventListener('showSavePresetDialog', onShowDialog));
    
</script>

<div 
    class="presets"
    class:presets--hidden={hidden}
>
    <Select 
        id="load-preset"
        background="transparent"
        options={$presetKeys.length 
            ? $presetKeys.map(key => ({name: key, value: key, active: true}))
            : [{name: 'Load preset', value: 'load', active: false}]
        }
        bind:selected={$active}
        disabled={!$presetKeys.length}
        classes="mr-2"
    />
    {#if showEdit}
        <div class="presets__edit">
            <Input
                id="preset-name"
                placeholder="TYPE A NAME..."
                showLabel={false}
                bind:value={editName}
                border="1px solid white"
                classes="mr-2"
            />
            <Button
                icon={faFloppyDisk}
                colour="yellow"
                onClick={() => {
                    savePreset(editName)
                    showEdit = false
                }}
            />
        </div>
    {/if}
    {#if !showEdit}
        <Button
            text="Save"
            colour="yellow"
            onClick={() => showEdit = true}
        />
    {/if}
    <!-- <button class="presets__chevron" on:click={onPrev}>
        <FontAwesomeIcon icon={faChevronLeft} />
    </button>

    <span class="presets__input">
        <input type="text" class={`presets__input ${!$presets[$active] ? 'presets__input--inactive' : ''}`} bind:value={$active} on:change={handleNameChange}/>
    </span>

    <button class="presets__store" on:click={() => savePreset($active)}>
        <FontAwesomeIcon icon={faFloppyDisk} />
    </button>

    <button class="presets__chevron" on:click={onNext}>
        <FontAwesomeIcon icon={faChevronRight} />
    </button> -->
</div>

<Dialog bind:dialog={save} on:close={() => save.close()}>
    <Save 
        on:save={() => save.close()} 
    />
</Dialog>

<style lang="scss">
    .presets {
        // background-color: var(--color-yellow);
        // border-radius: 5px;
        // font-size: var(--text-sm);
        // padding: 0.25rem 1rem;
        // text-transform: uppercase;
        // color: var(--color-grey-mid);
        // border-radius: 5px;
        // font-weight: 500;
        display: flex;
        align-items: center;
        &__edit {
            display: flex;
            align-items: center;
            height: 100%;

        }
        &__chevron {
            width: 1.5rem;
            text-align: center;
            cursor: pointer;
        }
        &__input {
            border: none;
            background-color: transparent;
            color: var(--color-grey-mid);
            font-size: var(--text-sm);
            font-weight: 500;
            text-transform: uppercase;
            text-align: center;
            width: 5rem;
            padding: 0;
            letter-spacing: 0.0625rem;

            &--inactive {
                color: var(--color-grey-light);
            }
        }

        &__store {
            margin: 0 0.5rem;
            cursor: pointer;
        }

        &--hidden {
            display: none;
        }
    }

    button:disabled {
        opacity: 0.2;
        cursor: not-allowed;
    }
</style>