<script lang="ts">
    import { connectedUsers, searchResults, activeUsersCount, search } from '$lib/stores/users'
    import { connect, getUsers } from '$lib/networking/users';
    // @ts-ignore
    import { FontAwesomeIcon } from 'fontawesome-svelte';
    import { faRefresh, faSearch } from '@fortawesome/free-solid-svg-icons';
    import Input from '$lib/components/Forms/Input.svelte';

    let showSearch = false;
</script>

<section>
    <div class="group">
        <h3 class="title">In your current session</h3>
        <ul class="users">
            <li class="users__user users__user--active">You</li>
            {#each $connectedUsers as user}
                <li 
                    class="users__user"
                    class:users__user--active={user.isActive}
                >
                    <span>{user.name} <button>Remove</button></span>
                </li>
            {/each}
        </ul>
    </div>
    <div class="group">
        <div class="search title">
            <h3 
                class="search__title"
                class:hidden={showSearch}
            >
                Everyone ({$activeUsersCount} Online)
                <button
                    class:hidden={showSearch}
                    on:click={getUsers}
                >
                    <FontAwesomeIcon 
                        icon={faRefresh} 
                    />
                </button>
            </h3>
            <button
                class="search__button"
                on:click={() => showSearch = !showSearch}
            >
                <FontAwesomeIcon 
                    icon={faSearch} 
                />
            </button>
            <div
                class="search__input" 
                class:hidden={!showSearch}
            >
                <Input 
                    id="search" 
                    placeholder="Search by ID or name"
                    showLabel={false}
                    bind:value={$search}
                    on:escape={() => showSearch = false}
                />
            </div>
        </div>
        {#each $searchResults as user}
            <li 
                class="users__user"
                class:users__user--active={user.isActive}
            >
                <span>{user.name} 
                    <button
                        on:click={() => connect(user.id)}
                    >Connect</button>
                </span>
            </li>
        {/each}
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

        .users {
            list-style: none;
            padding: 0.5rem 0 0;
            margin: 0;

            &__user {
                text-transform: uppercase;
                font-size: var(--text-xs);
                display: flex;
                align-items: center;
                margin-bottom: 1rem;

                &::before {
                    content: "";
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    border: 0.5px solid white;
                    margin-right: 0.75rem;
                }

                &--active::before {
                    border: none;
                    background-color: #00FF00;
                }

                & span {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                }

                & button {
                    text-transform: uppercase;
                    font-size: var(--text-xs);
                }
            }
        }

        .search {
            display: flex;
            &__input {
                margin-left: 0.5rem;

            }
            &__title {
                width: 100%;
                font-size: var(--text-sm);
            }
        }
    }
</style>
