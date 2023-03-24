<script lang="ts">
    import { get } from 'svelte/store';
    import AudioKeys from 'audiokeys';
    import Key from './Key.svelte';
    import { handleEvent, handleNoteOff } from '../../../sound';
    import { synthValues } from '$lib/stores/parameters';
    
    const keyboard = new AudioKeys({
        polyphony: 4,
        rows: 2,
        priority: 'last',
    });

    let mousedown = false;

    let notes: number[] = [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83];
    let activeNotes: number[] = [];

    function depressKey(note: number) {
        activeNotes = [...activeNotes, note];
        handleEvent({...get(synthValues), n: note, amp: 1})
    }

    function releaseKey(note: number) {
        activeNotes = activeNotes.filter(n => n !== note);
        handleNoteOff({...get(synthValues), n: note})
    }

    keyboard.down( ({note} : {note: number}) => {
        depressKey(note);
    });

    keyboard.up( ({note} : {note: number}) => {
        releaseKey(note);
    });

    function handleMousedown(e: CustomEvent<any>) {
        mousedown = true;
        depressKey(e.detail);
    }

    function handleMouseup(e: CustomEvent<any>) {
        mousedown = false;
        releaseKey(e.detail);
    }

    function handleMouseleave(e: CustomEvent<any>) {
        releaseKey(e.detail);
    }

    function handleMouseenter(e: CustomEvent<any>) {
        if(!mousedown) return;
        depressKey(e.detail);
    }
</script>

<div class="piano">
    <div 
        on:mouseleave={() => mousedown = false}
        class="piano-keys"
    >
        {#each notes as note, i}
            <Key 
                note={note}
                colour={[1,3,6,8,10].includes(i%12) ? 'black' : 'white'}
                isActive={activeNotes.includes(note)}
                on:down={handleMousedown}
                on:up={handleMouseup}
                on:leave={handleMouseleave}
                on:enter={handleMouseenter}
            />
        {/each}
        
    </div>
</div>

<style>
    .piano {
        width: 100%;
        margin: 0 auto;
        height: 100%;
        box-shadow: 2px 3px 5px 1px var(--color-box-shadow);
        max-height: 8rem;
    }
    
    .piano-keys{
        height: 100%;
        width: 100%;
        display: flex;
        word-spacing: 0;
        letter-spacing: 0;
    }
</style>