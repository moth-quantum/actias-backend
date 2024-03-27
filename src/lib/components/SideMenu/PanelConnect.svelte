<script lang="ts">
    import { connectedUsers, otherUsers } from '$lib/stores/users'
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
                    <span>{user.username} <button>Remove</button></span>
                </li>
            {/each}
        </ul>
    </div>
    <div class="group">
        <h3 class="title">Everyone</h3>
        {#each $otherUsers as user}
            <li 
                class="users__user"
                class:users__user--active={user.isActive}
            >
                <span>{user.username} <button>Connect</button></span>
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
