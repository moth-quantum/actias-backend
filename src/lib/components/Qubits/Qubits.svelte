<script lang="ts">
    import { qubits } from '$lib/stores/qubits';
    import Qubit from './Qubit.svelte';
    import Patchbay from '$lib/components/Patching/Patchbay.svelte';
    
    let axesIds = $qubits[0].axes.map(({key}) => key);
    let axesNames = $qubits[0].axes.map(({name}) => name);
</script>

<div class="qubits">
    {#each $qubits.filter(q => q.active) as qubit, i}
        <div 
            class="qubit"
            style="max-height: 30rem;"
        >
            <Qubit />
            <div class="qubit__patchbay">    
                <Patchbay 
                    ids={axesIds.reverse()} 
                    labels={axesNames.reverse()} 
                />
            </div>
        </div>
    {/each}
</div>


<style lang="scss">
    .qubits {
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        display: flex;
        flex-wrap: wrap;
        background-color: blue;

    }
    
    .qubit {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;

        .qubit__patchbay {
            position: absolute;
            bottom: 1rem;
            left: 0;
            right: 0;
            
        }
    }
</style>