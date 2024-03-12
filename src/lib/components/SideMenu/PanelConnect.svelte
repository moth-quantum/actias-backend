<script lang="ts">
    
</script>

<section>
    <h2>Connect</h2>
    <div class="group">
        <h3 class="title">In your current session</h3>
        <ul class="users">
            <li class="users__user">You</li>
        </ul>
    </div>
    <div class="group">
        <h3 class="title">Everyone</h3>
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
            padding: 0;
            margin: 0;

            &__user {
                text-transform: uppercase;
                font-size: var(--text-xs);
                display: flex;
                align-items: center;

                &::before {
                    content: "";
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background-color: #00FF00;
                    margin-right: 0.75rem;
                }
            }
        }
    }
</style>
