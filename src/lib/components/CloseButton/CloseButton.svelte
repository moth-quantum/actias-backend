<script lang="ts">
    import Button from '$lib/components/Button/Button.svelte';
    import { faXmark } from '@fortawesome/free-solid-svg-icons';

    export let onClick: () => void;

</script>

<Button
    colour="primary"
    text="Close"
    onClick={onClick}
    icon={faXmark}
/>

