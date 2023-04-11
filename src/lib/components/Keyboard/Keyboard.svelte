<script lang="ts">
    import { WebMidi } from 'webmidi';
    import { get } from 'svelte/store';
    import AudioKeys from 'audiokeys';
    import Key from './Key.svelte';
    import { handleEvent, handleNoteOff } from '../../../sound';
    import { synthValues } from '$lib/stores/parameters';
    import { inputs } from '$lib/stores/midi';
    import { onMount } from 'svelte';
    
    const keyboard = new AudioKeys({
        polyphony: 6,
        rows: 2,
        priority: 'last',
    });

    let mousedown = false;

    let notes: number[] = [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83];
    let keys: number[] = notes
    let activeNotes: number[] = [];
    let isMobile = false;
    let isTouch = false;

    function depressKey(n: number, amp: number = 0.5) {
        activeNotes = [...activeNotes, n];
        handleEvent({...get(synthValues), n, amp})
    }

    function releaseKey(note: number) {
        if(!activeNotes.includes(note)) return;
        activeNotes = activeNotes.filter(n => n !== note);
        handleNoteOff(get(synthValues).inst, note)
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
        // mousedown = false;
        releaseKey(e.detail);
    }

    function handleMouseenter(e: CustomEvent<any>) {
        if(!mousedown) return;
        // Suppressed for now, due to notes sticking
        depressKey(e.detail);
    }

    function activateInput(name: string) {
        const input = WebMidi.getInputByName(name);

        input?.addListener("noteon", e => {
            depressKey(e.note.number, e.velocity);
        })

        input?.addListener("noteoff", e => {
            releaseKey(e.note.number);
        })
    }

    function deactivateInput(name: string) {
        const input = WebMidi.getInputByName(name);
        input?.removeListener("noteon");
        input?.removeListener("noteoff");
    }

    inputs.subscribe($inputs => {
        WebMidi
            .enable()
            .then(() => $inputs.forEach(({name, active}) => {
                active 
                    ? activateInput(name)
                    : deactivateInput(name)
            }))
    })

    onMount(() => {
        isMobile = window.innerWidth < 650;
    })

    $: keys = isMobile ? notes.slice(0, 12) : notes;
    
</script>

<div class="piano">
    <div class="piano-keys">
        {#each keys as note, i}
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

<svelte:window on:resize={() => isMobile = window.innerWidth < 650} />

<style lang="scss">
    .piano {
        width: 100%;
        margin: 0 auto;
        height: 100%;
        min-height: 7rem;
        box-shadow: 2px 3px 5px 1px var(--color-box-shadow);
    }
    
    .piano-keys{
        height: 100%;
        width: 100%;
        display: flex;
        word-spacing: 0;
        letter-spacing: 0;
    }
</style>