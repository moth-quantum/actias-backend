<script lang="ts">
    import qubitImg from '$lib/images/qubit.png';
    import { qubits } from '$lib/stores/qubits';
    import Select from '$lib/components/Forms/Select.svelte';

    function handleAddQubit() {
        const i = $qubits.findIndex(q => !q.active);
        i !== -1 && qubits.update(qs => {
            qs[i].active = true;
            return qs
        })
        
    }
</script>

<section>
    <h2>Assign Qubits</h2>
    <div class="qubits">
        {#each $qubits.filter(q => q.active) as qubit, i}
            <div class="qubits__qubit">
                <div class="qubit__placeholder">
                    <img src={qubitImg} alt="qubit" />
                    <span class="qubit__i qubit__i--{i}">{i.toString().padStart(2, '0')}</span>
                </div>

                <div class="qubit__user">
                    <Select 
                        id={`${i}`}
                        options={[
                            { name: 'John', value: 'john', active: true },
                            { name: 'Alice', value: 'alice', active: true },
                            { name: 'Bob', value: 'bob', active: true },
                            { name: 'Emma', value: 'emma', active: true },
                            { name: 'Michael', value: 'michael', active: true },
                        ]}
                        onChange={(e) => console.log(e)}
                    />
                </div>
            </div>
        {/each}

        {#if $qubits.some(q => !q.active)}
            <div class="qubits__qubit">
                <button 
                    on:click={handleAddQubit}
                    class="qubit__placeholder qubit__add-qubit"
                >
                    <img src={qubitImg} alt="qubit" />
                    <span>+</span>
                </button>
            </div>
        {/if}
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

        .qubits {
            display: flex;
            flex-wrap: wrap;
            &__qubit {
                width: calc(50% - 1rem);
                
                margin-bottom: 2rem;

                &:nth-child(odd) {
                    margin-right: 2rem;
                }
            }

        }

        .qubit {
            &__placeholder {
                position: relative;
                background-color: var(--color-grey-darker);
                border-radius: 20px;
                margin-bottom: 1rem;
            }

            &__add-qubit {
                border: 1px dashed var(--color-grey-light);
                img {
                    opacity: 0.1;
                }

                span {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 3rem;
                    font-weight: 200;
                    color: var(--color-grey-light);
                }
            }

            &__i {
                position: absolute;
                top: 85%;
                left: 80%;
                transform: scale(0.8) translate(-50%, -50%);
                font-size: var(--text-xs);
                color: white;
                padding: 0.125rem 0.5rem;
                border-radius: 10px;
                color: var(--color-grey-darker);
                font-weight: bold;
                text-align: center;
                @for $i from 0 through 11 {
                    &--#{$i} {
                        background-color: var(--color-theme-#{$i%3 + 1});
                    }
                }
            }
            
        }

    }
</style>
