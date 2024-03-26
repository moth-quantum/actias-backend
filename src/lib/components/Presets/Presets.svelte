<script lang="ts">
    import Dialog from '$lib/components/Dialog/Dialog.svelte';
    import Save from '$lib/components/Dialog/Save.svelte';
    import Select from '$lib/components/Forms/Select.svelte';
    import Button from '$lib/components/Button/Button.svelte';
    import Input from '$lib/components/Forms/Input.svelte';
    import { presetKeys, presets, savePreset, deletePreset, activePreset as active } from '$lib/stores/presets';
    import { FontAwesomeIcon } from 'fontawesome-svelte';
    import { library } from '@fortawesome/fontawesome-svg-core';
    import { faAdd, faChevronLeft, faChevronRight, faFloppyDisk, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
    import { onMount, onDestroy } from 'svelte';
    
    library.add(faChevronLeft, faChevronRight, faFloppyDisk, faTrash, faPen, faAdd);

    export let hidden = false;
    let save: HTMLDialogElement;
    let showSave = false;
    let saveName = '';
    $: current = $active || 'load';

    const handleNameChange = (e: Event) => {
        // @ts-ignore
        const name = e.target?.value
        if(!name) return

        presets.update(presets => {
            const newPresets = {...presets}
            newPresets[name] = newPresets[current]
            delete newPresets[current]
            return newPresets
        })
    }

    const onShowDialog = () => save?.showModal();
        
    onMount(() => {
        document.addEventListener('showSavePresetDialog', onShowDialog)
        
    });
    onDestroy(() => document.removeEventListener('showSavePresetDialog', onShowDialog));
    
</script>

<svelte:window on:keydown={e => {
    if(e.key === 'Escape') showSave = false
}} />


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
        disabled={!$presetKeys.length}
        classes="mr-2"
        selected={current}
    />
    {#if showSave}
        <div class="presets__save">
            <Input
                id="preset-name"
                placeholder="TYPE A NAME..."
                showLabel={false}
                bind:value={saveName}
                border="1px solid white"
                classes="mr-2"
            />
            <Button
                icon={faFloppyDisk}
                colour="yellow"
                onClick={() => {
                    savePreset(saveName)
                    showSave = false
                }}
            />
            
        </div>
    {/if}
    {#if $active && !showSave}
        <Button
            icon={faPen}
            colour="yellow"
            onClick={() => {
                // savePreset(saveName)
                // showSave = false
            }}
            classes="mr-2"
        />
        <Button
            icon={faTrash}
            colour="yellow"
            onClick={() => deletePreset(current)}
            classes="mr-2"
        />
        <Button
            icon={faAdd}
            colour="yellow"
            onClick={() => showSave = true}
        />
    {/if}
    {#if !$active && !showSave}
        <Button
            text="Save"
            colour="yellow"
            onClick={() => showSave = true}
        />
    {/if}
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
        &__save {
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