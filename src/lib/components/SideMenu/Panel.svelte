<script lang="ts">
    import Button from "$lib/components/Button/Button.svelte";
    import { faTimes } from "@fortawesome/free-solid-svg-icons";
    import { library } from '@fortawesome/fontawesome-svg-core';
    library.add(faTimes);

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let title: string;
</script>

<section>
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
    <slot />
</section>

<style lang="scss">
    section {
        display: flex;
        flex-direction: column;

        header {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 2rem;
        }

        & h2 {
            text-align: center;
            font-size: var(--text-sm);
            padding: 4px 0 calc(2rem + 4px);
            color: white;
        }
    }
</style>
