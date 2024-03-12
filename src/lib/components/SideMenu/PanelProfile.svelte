<script lang="ts">
    import { id, username, location } from '$lib/stores/user'
    import Input from '$lib/components/Forms/Input.svelte'
</script>

<section>
    <h2>Your Profile</h2>
    <div class="input">
        <Input id="id" label="ID" bind:value={$id} />
    </div>
    <div class="input">
        <Input id="username" label="Username" bind:value={$username} />
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

        & h2 {
            text-align: center;
            font-size: var(--text-sm);
            padding: 4px 0 calc(2rem + 4px);
        }
    }
</style>
