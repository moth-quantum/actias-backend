<script lang="ts">
    import qubitImg from '$lib/images/qubit.png';
    import { qubits, activateQubit, deactivateQubit } from '$lib/stores/qubits';
    import { connectedUsers, getUserColour } from '$lib/stores/users';
    import Select from '$lib/components/Forms/Select.svelte';
    // @ts-ignore
    import { FontAwesomeIcon } from 'fontawesome-svelte';
    import { library } from '@fortawesome/fontawesome-svg-core';
    import { faClose } from '@fortawesome/free-solid-svg-icons';
    library.add(faClose);
</script>

<section>
    <h2>Assign Qubits</h2>
    <div class="qubits">
        {#each $qubits.filter(q => q.active) as qubit, i}
            <div class="qubits__qubit">
                <div 
                    class="qubit__placeholder"
                    style="box-shadow: 0 0 10px {getUserColour(qubit.user)};"
                >
                    <img src={qubitImg} alt="qubit" />
                    <span 
                        class="qubit__i"
                        style="background-color: {getUserColour(qubit.user)}"
                    >{(i+1).toString().padStart(2, '0')}</span>
                    {#if i && i === ($qubits.filter(q => q.active).length - 1)}
                        <button on:click={() => deactivateQubit()}>
                            <FontAwesomeIcon icon={faClose} />
                        </button>
                    {/if}
                </div>

                <div class="qubit__user">
                    <Select 
                        id={`${i}`}
                        options={[
                            { name: 'You', value: 'you', active: true },
                            ...$connectedUsers.map(user => ({ name: user.username, value: user.id, active: true }))
                        ]}
                        background={getUserColour(qubit.user)}
                        color="var(--color-grey-darker)"
                        border="none"
                        bind:selected={qubit.user}
                    />
                </div>
            </div>
        {/each}

        {#if $qubits.some(q => !q.active)}
            <div class="qubits__qubit">
                <button 
                    on:click={() => activateQubit()}
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
                border: 1px solid white;
                button {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    transform: translate(50%, -50%);
                    color: var(--color-grey-light);
                    cursor: pointer;
                    font-size: 0.75rem;
                    transition: background-color 0.2s;
                    &:hover {
                        color: var(--color-theme-1);
                    }
                }
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
                // @for $i from 0 through 11 {
                //     &--#{$i} {
                //         background-color: var(--color-theme-#{$i%3 + 1});
                //     }
                // }
            }
            
        }

    }
</style>
