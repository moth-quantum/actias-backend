<script>
import Select from '$lib/components/Forms/Select.svelte';   
</script>

<div class="measure">
    <h2>Measure</h2>
    <form>
        <div class="source">
            <Select id="source" options={['Local', 'Remote']} />
        </div>
        <input id="seconds" size="sm" placeholder={10.00} type="number" />
        <input id="bpm" size="sm" placeholder="BPM" type="number" />
        <input id="bars" size="sm" placeholder="Bars" type="number" />
        <button>Measure</button>
    </form>
</div>

<style lang="scss">
    .measure {
        padding: 1rem 1rem;
        @media (min-width: 1200px) {
            padding: 0;
        }
    }
    h2 {
        display: none;
        padding-bottom: 0.25rem;
        margin-bottom: 0.5rem;
        border-bottom: 0.5px solid var(--color-grey-light);

        @media (min-width: 1200px) {
            display: block;
        }
    }

    form {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 0.5rem;
        grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
    }

    input {
        font-size: var(--text-sm);
        color: var(--color-grey-mid);
        text-transform: uppercase;
        padding: 0.125rem 0.75rem;
        width: 100%;
        border-radius: 5px;
    }

    input::placeholder {
        color: var(--color-grey-mid);
    }

    .source {
        grid-column: 1 / 3;
    }

    #seconds {
        grid-column: 1 / 3;
        grid-row: 2;
    }

    #bpm {
        grid-column: 1;
        grid-row: 3;
    }

    #bars {
        grid-column: 2;
        grid-row: 3;
    }

    button {
        grid-column: 1 / 3;
        grid-row: 4 / 6;
        background-color: var(--color-grey-light);
        font-size: var(--text-base);
        color: var(--color-yellow);
        text-transform: uppercase;
        border: 0;
        border-radius: 5px;
        padding: 0.25rem 0.75rem;
        font-weight: 600;
        cursor: pointer;
    }
</style>