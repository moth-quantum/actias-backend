<script lang="ts">
    import { inputs } from '$lib/stores/midi';
    import Select from '../Forms/Select.svelte';
</script>

<section>
    <h2>Midi Config</h2>
    <div class="group">
        <h3 class="title">Devices</h3>
        <Select id="device" options={$inputs} onChange={e => console.log('add device')} />
    </div>
    <div class="group">
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

        & .group {
            margin-bottom: 2rem;            
        }

        
    }
</style>
