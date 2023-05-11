<script lang="ts">
    import { Toast } from 'flowbite-svelte';
  import { onMount } from 'svelte';
    export let message: string;
    export let type: string;

    let show = true;
    let counter = 5;

    function timeout() {
        if (--counter > 0 && show) return setTimeout(timeout, 1000);
        show = false;
    }

    onMount(() => {
        timeout();
    });
</script>

<Toast class="mb-2" color="none" bind:open={show} on:close={() => show = false}>
    <svelte:fragment slot="icon">
        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
    </svelte:fragment>
    {message}
</Toast>

