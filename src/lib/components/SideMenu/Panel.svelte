<script lang="ts">
    import Button from "$lib/components/Button/Button.svelte";
    import { faTimes } from "@fortawesome/free-solid-svg-icons";

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let title: string;
    export let hideHeader: boolean = false;
</script>

<aside>
    {#if !hideHeader}
        <header>
            <Button 
                text="close" 
                icon={faTimes}
                onClick={() => dispatch('close')}
                colour="dark"
                narrow={true}
                invert={true}
                classes="pr-0"
            />
        </header>
        <h2>{title}</h2>
    {/if}
    <div class="content">
        <slot />
    </div>
</aside>

<style lang="scss">
    aside {
        display: flex;
        flex-direction: column;
        height: 100%;

        header {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 3rem;
            margin-right: -1rem;
        }

        & h2 {
            text-align: center;
            font-size: var(--text-sm);
            padding: 4px 0 calc(2rem + 4px);
            color: white;
        }

        .content {
            display: flex;
            flex-direction: column;
            height: 100%;
        }
    }
</style>
