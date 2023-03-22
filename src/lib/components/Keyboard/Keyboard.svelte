<script>
    import AudioKeys from 'audiokeys';
    import Key from './Key.svelte';
    
    const keyboard = new AudioKeys({
        polyphony: 4,
        rows: 2,
        priority: 'last',
    });

    let mousedown = false;

    /**
    * @type {number[]}
    */
    let notes = [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83];
    
    /**
    * @type {number[]}
    */
    let activeNotes = [];

    /**
    * @param {number} note
    */
    function depressKey(note) {
        activeNotes = [...activeNotes, note];
    }

    /**
     * @param {number} note
     */
    function releaseKey(note) {
        activeNotes = activeNotes.filter(n => n !== note);
    }

    keyboard.down( function(note) {
        depressKey(note.note);
    });

    keyboard.up( function(note) {
        releaseKey(note.note);
    });

    function handleMousedown(e) {
        mousedown = true;
        depressKey(e.detail);
    }

    function handleMouseup(e) {
        mousedown = false;
        releaseKey(e.detail);
    }

    function handleMouseleave(e) {
        releaseKey(e.detail);
    }

    function handleMouseenter(e) {
        if(!mousedown) return;
        depressKey(e.detail);
    }
</script>

<div class="piano">
    <div class="piano-container">
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
</div>

<style>
    .piano {
        width: 100%;
        margin: 0 auto;
        box-shadow: 2px 3px 5px 1px var(--color-box-shadow);
    }

    .piano-keys{
        width: 100%;
        display: flex;
        word-spacing: 0;
        letter-spacing: 0;
    }
</style>