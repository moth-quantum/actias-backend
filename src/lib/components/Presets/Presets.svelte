<script lang="ts">
    import Dialog from '$lib/components/Dialog/Dialog.svelte';
    import Save from '$lib/components/Dialog/Save.svelte';
    import Select from '$lib/components/Forms/Select.svelte';
    import Button from '$lib/components/Button/Button.svelte';
    import Input from '$lib/components/Forms/Input.svelte';
    import { faAdd, faFloppyDisk, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
    import { mute } from '$lib/stores/global';
    import type { Writable } from 'svelte/store';
    
    export let type: string;
    export let hidden = false;
    export let keys: string[] = [];
    export let active: Writable<string>;
    export let savePreset: (name: string) => void;
    export let deletePreset: (name: string) => void;
    export let editPreset: (name: string) => void;
    
    let save: HTMLDialogElement;
    let isSaving = false;
    let isEditing = false;
    let name = '';
    $: current = $active || 'load';
    
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

    const handleSelectChange = (e: Event) => {
        active.set((e.target as HTMLSelectElement).value)
    }
</script>

<svelte:window on:keydown={e => {
    if(e.key === 'Escape' || e.key === 'Enter') {
        isSaving = false
        isEditing = false
        mute.set(false)
    }
}} />

<div 
    class="presets"
    class:presets--hidden={hidden}
>
    {#if !isEditing && !isSaving}
        <Select 
            id={`preset-${type}`}
            isLearnable={false}
            background="transparent"
            options={[
                {name: `Load ${type}`, value: 'load', active: false},
                ...keys.map(key => ({name: key, value: key, active: true}))
            ]}
            disabled={!keys.length}
            selected={current}
            onChange={handleSelectChange}
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
    
    {#if $active !== 'load' && !isSaving}
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
        align-items: center;
        
        &--hidden {
            display: none;
        }
        
        @media (min-width: 500px) {
            display: flex;
        }
    }
</style>