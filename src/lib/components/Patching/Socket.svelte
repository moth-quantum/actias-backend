<!-- TODO: add in patch cord here -->

<script>
    // @ts-nocheck
    import { onMount } from 'svelte';
    import { draggable } from '@neodrag/svelte';
    import { sockets, connections, activateSocket, deactivateSockets, connectSockets, disconnectSocket } from '$lib/stores/patching';
    import Cable from '$lib/components/Patching/Cable.svelte';

    export let id;
    export let type;
    export let active = false;
    export let align = "center";
    export let colour = 'blue';
    export let offset = 0;

    let thisSocket;
    let allSockets;
    let connectedTo = [];
    let position = {x: 0, y: 0};

    function handleDragStart({ offsetX, offsetY }) {
        position = { x: offsetX, y: offsetY }
        thisSocket.style.zIndex = 1002;
    }

    function handleDragEnd(e) {
        const {x: targetX, y: targetY} = e.target?.getBoundingClientRect();
        
        // find connecting socket
        const socketId = Object.keys(allSockets).find(id => {
            const {x, y, width} = allSockets[id];
            return targetX > x - width && targetX < x + width && targetY > y - width && targetY < y + width;
        });
        
        // if socket found and not of same type, connect
        socketId && connectSockets(allSockets[id], allSockets[socketId]);
        
        // return to original position
        position = {x: 0, y: 0}
        thisSocket.style.zIndex = 999;
    }

    function handleClick() {
        activateSocket(id)
    }

    function handleKeydown(e) {
        e.key === "Escape" && deactivateSockets();
        e.key === "Backspace" && active && disconnectSocket(id);
    }

    function init() {
        // init socket
        const {x, y, width} = thisSocket.getBoundingClientRect();
        // add to store
        sockets.update(s => ({...s, [id]: {...s[id], id, x, y, width, active, type, colour, offset}}));
    }

    onMount(() => {
        init();
        sockets.subscribe(sockets => {
            allSockets = sockets;
            active = sockets[id]?.active;
        });
        connections.subscribe(connections => {
            connectedTo = connections.filter(c => c[0] === id)?.map(c => c[1]) || [];
        })

        return () => console.log('unmounting')
    });

</script>

<svelte:window 
    on:resize={init} 
    on:keydown={handleKeydown}
/>

<div class={`socket__container socket__container--${align}`}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div 
        class={`socket socket--${type} socket--${id} ${active ? " active" : ""}`}
        bind:this={thisSocket}
        use:draggable={{bounds: 'body', position}}
        on:neodrag={handleDragStart}
        on:neodrag:end={handleDragEnd}
        on:click={handleClick}
    ></div>
    {#each connectedTo as socketId (socketId)}
        <Cable
            colour={allSockets[socketId].colour}
            offset={allSockets[socketId].offset}
            from={{x: allSockets[id].x + allSockets[id].width/2, y: allSockets[id].y + allSockets[id].width/2}}
            to={{x: allSockets[socketId].x + allSockets[socketId].width/2 - 0.5, y: allSockets[socketId].y + allSockets[socketId].width/2}}
        ></Cable>
    {/each}
</div>

<style>
    .socket__container {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .socket__container--left {
        justify-content: flex-start;
    }

    .socket__container--right {
        justify-content: flex-end;
    }

    .socket {
        width: 1.2rem;
        height: 1.2rem;
        background-color: #000;
        border-radius: 50%;
        
        cursor: pointer;
        display: inline-block;
        z-index: 999;
    }

    .socket--origin {
        border: 0.2rem solid var(--color-grey-dark);
    }

    .socket--remote {
        border: 0.2rem solid var(--color-grey-light);
    }

    .active {
        outline: 2px solid var(--color-theme-3);
    }
</style>