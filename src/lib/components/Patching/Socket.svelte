<script lang="ts">
    // @ts-nocheck
    import { onMount, tick } from 'svelte';
    import { draggable } from '@neodrag/svelte';
    import { sockets, connections, activateSocket, deactivateSockets, connectSockets, disconnectSocket } from '$lib/stores/patching';
    import Cable from '$lib/components/Patching/Cable.svelte';
    import { instrumentParameters } from '$lib/stores/parameters';
    import { focusedQubit } from '$lib/stores/qubits';

    export let id;
    export let type;
    export let active = false;
    export let align = "center";
    export let colour = 'blue';
    export let offset = 0;

    let thisSocket;
    let connectedTo = [];
    let position = {x: 0, y: 0};

    function handleDragStart({ offsetX, offsetY }) {
        position = { x: offsetX, y: offsetY }
        thisSocket.style.zIndex = 1002;
        thisSocket.classList.add('socket--dragging');
    }

    function handleDragEnd(e) {
        const target = e.target?.getBoundingClientRect();
        const targetX = target.x + window.scrollX;
        const targetY = target.y + window.scrollY;
        
        // find connecting socket
        const socketId = Object.keys($sockets).find(id => {
            const {x, y, width} = $sockets[id];
            return targetX > x - width && targetX < x + width && targetY > y - width && targetY < y + width;
        });
        
        // if socket found and not of same type, connect
        socketId && connectSockets($sockets[id], $sockets[socketId]);
        
        // return to original position
        position = {x: 0, y: 0}
        thisSocket.style.zIndex = 10;
        thisSocket.classList.remove('socket--dragging');
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
        const position = thisSocket.getBoundingClientRect();
        const x = position.x + window.scrollX;
        const y = position.y + window.scrollY;
        const width = position.width;
        // add to store
        sockets.update(s => ({...s, [id]: {...s[id], id, x, y, width, active, type, colour, offset}}));
    }

    const unsubscribeInstrumentParameters = instrumentParameters.subscribe(async () => {
        await tick();
        thisSocket && init();
    })

    onMount(() => {
        init();
        document.addEventListener('redrawCables', init)
        
        const unsubscribeSockets = sockets.subscribe(sockets => {
            active = sockets[id]?.active;
        });
        const unsubscribeConnections = connections.subscribe(connections => {
            connectedTo = connections.filter(c => c[0] === id)?.map(c => c[1]) || [];
        })

        return () => {
            document.removeEventListener('redrawCables', init)
            unsubscribeSockets();
            unsubscribeConnections();
            unsubscribeInstrumentParameters();
        }

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
    >
        {#if $sockets[connectedTo] || type == 'remote'}
            <div 
                class="socket__inner"
                style={`background-color: ${$sockets[connectedTo]?.colour || colour}`}
            />
        {/if}
    </div>
    {#each connectedTo as socketId (socketId)}
        {#if $sockets[socketId]}
            <Cable
                colour={$sockets[socketId].colour}
                offset={$sockets[socketId].offset}
                from={{x: $sockets[id].x + $sockets[id].width/2, y: $sockets[id].y + $sockets[id].width/2}}
                to={{x: $sockets[socketId].x + $sockets[socketId].width/2 - 0.5, y: $sockets[socketId].y + $sockets[socketId].width/2}}
                isFocused={connectedTo[0] && +connectedTo[0].substring(1) === $focusedQubit}
            ></Cable>
        {/if}
    {/each}
</div>

<style lang="scss">
    .socket__container {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        &--left {
            justify-content: flex-start;
        }
    
        &--right {
            justify-content: flex-end;
        }
    }

    .socket {
        width: 1.2rem;
        height: 1.2rem;
        background-color: #000;
        border-radius: 50%;
        cursor: grab;
        display: flex;
        justify-content: center ;
        align-items: center;
        z-index: 15;

        &__inner {
            width: 0.4rem;
            height: 0.4rem;
            background-color: var(--color-grey-darker);
            border-radius: 50%;
        }

        &--dragging {
            cursor: grabbing;
        }
        &--origin {
            border: 0.2rem solid var(--color-grey-dark);
        }
    
        &--remote {
            border: 0.2rem solid var(--color-grey-light);
        }
    }


    .active {
        outline: 2px solid var(--color-theme-3);
    }
</style>