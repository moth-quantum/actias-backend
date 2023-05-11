<script lang="ts">
    import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
  
    export let src: string;
</script>

<LottiePlayer
    src={src}
    autoplay="{true}"
    loop="{true}"
    controls="{false}"
    renderer="svg"
    background="transparent"
/>