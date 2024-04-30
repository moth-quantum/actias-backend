<script lang="ts">
    import { id, name, location } from '$lib/stores/profile'
    import Input from '$lib/components/Forms/Input.svelte'
</script>

<section>
    <div class="input">
        <Input id="id" label="ID" bind:value={$id} readonly={true}/>
    </div>
    <div class="input">
        <Input id="name" label="name" bind:value={$name} />
    </div>
    <div class="input">
        <Input id="location" label="Location" bind:value={$location}/>
    </div>
</section>

<style lang="scss">
    section {
        display: flex;
        flex-direction: column;

        & .input {
            display: flex;
            flex-direction: column;
            margin-bottom: 2rem;
        }
    }
</style>
