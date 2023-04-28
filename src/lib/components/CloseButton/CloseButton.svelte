<script lang="ts">
    import Button from '$lib/components/Button/Button.svelte';
    import { library } from '@fortawesome/fontawesome-svg-core';
    import { faXmark } from '@fortawesome/free-solid-svg-icons';
    library.add(faXmark);

    export let onClick: () => void;

</script>

<Button
    colour="primary"
    text="Close"
    onClick={onClick}
    icon={faXmark}
/>