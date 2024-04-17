<script lang="ts">
    import { connectedUsers, users, activeUsersCount } from '$lib/stores/users'
    import { connect, getUsers } from '$lib/networking/users';
    // @ts-ignore
    import { FontAwesomeIcon } from 'fontawesome-svelte';
    import { faRefresh } from '@fortawesome/free-solid-svg-icons';
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
        <h3 class="title">Everyone ({$activeUsersCount} Online) 
            <button
                on:click={getUsers}
            >
                <FontAwesomeIcon 
                    icon={faRefresh} 
                />
            </button>
        </h3>
        {#each $users as user}
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
    }
</style>
