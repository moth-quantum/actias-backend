<script lang="ts">
    // @ts-ignore
    import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
  
    export let src: any;
</script>

<LottiePlayer
    src={src}
    autoplay="{true}"
    loop="{true}"
    controls="{false}"
    renderer="svg"
    background="transparent"
    width="100%"
    height="100%"
/>