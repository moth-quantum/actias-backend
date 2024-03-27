<script lang="ts">
    import Dialog from '$lib/components/Dialog/Dialog.svelte';
    import Save from '$lib/components/Dialog/Save.svelte';
    import Select from '$lib/components/Forms/Select.svelte';
    import Button from '$lib/components/Button/Button.svelte';
    import Input from '$lib/components/Forms/Input.svelte';
    import { presetKeys, savePreset, deletePreset, editPreset, activePreset as active } from '$lib/stores/presets';
    import { library } from '@fortawesome/fontawesome-svg-core';
    import { faAdd, faChevronLeft, faChevronRight, faFloppyDisk, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
    import { onMount, onDestroy } from 'svelte';
    
    library.add(faChevronLeft, faChevronRight, faFloppyDisk, faTrash, faPen, faAdd);

    export let hidden = false;
    let save: HTMLDialogElement;
    let isSaving = false;
    let isEditing = false;
    let name = '';
    $: current = $active || 'load';

    const onShowDialog = () => save?.showModal();
        
    onMount(() => document.addEventListener('isSaving', onShowDialog));
    onDestroy(() => document.removeEventListener('isSaving', onShowDialog));
    
    const handleSave = () => {
        isEditing 
            ? editPreset(name)
            : savePreset(name)
        isSaving = false
        isEditing = false
    }

    const handleEdit = () => {
        name = current
        isEditing = true
        isSaving = true
    }

    const handleDelete = () => {
        deletePreset(current)
    }

    const handleNew = () => {
        name = ''
        isSaving = true
    }
</script>

<svelte:window on:keydown={e => {
    if(e.key === 'Escape') {
        isSaving = false
        isEditing = false
    }
}} />

<div 
    class="presets"
    class:presets--hidden={hidden}
>
    {#if !isEditing && !isSaving}
        <Select 
            id="load-preset"
            background="transparent"
            options={[
                {name: 'Load preset', value: 'load', active: false},
                ...$presetKeys.map(key => ({name: key, value: key, active: true}))
            ]}
            disabled={!$presetKeys.length}
            selected={current}
            onChange={e => active.set(e.target.value)}
        />
    {/if}
    
    {#if isEditing || isSaving}
        <Input
            id="preset-name"
            placeholder={'TYPE A NAME...'}
            showLabel={false}
            bind:value={name}
            border="1px solid white"
            classes="ml-2"
            uppercase={true}
            on:enter={handleSave}
        />
    {/if}
    
    {#if isEditing || isSaving}
        <Button
            icon={faFloppyDisk}
            colour="yellow"
            onClick={handleSave}
            classes="ml-2"
            narrow={true}
        />        
    {/if}
    
    {#if $active && !isSaving}
        <Button
            icon={faPen}
            colour="yellow"
            onClick={handleEdit}
            classes="ml-2"
            narrow={true}
        />
        <Button
            icon={faTrash}
            colour="yellow"
            onClick={handleDelete}
            classes="ml-2"
            narrow={true}
        />
    {/if}
    
    {#if !isEditing && !isSaving}
        <Button
            icon={faAdd}
            colour="yellow"
            onClick={handleNew}
            classes="ml-2"
            narrow={true}
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
        display: none;
        @media (min-width: 500px) {
            display: flex;
        }
        align-items: center;

        &--hidden {
            display: none;
        }
    }
</style>