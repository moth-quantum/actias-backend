<script lang="ts">
    export let data: number[];
    export let labels: string[];
    export let stream: number[][] = [];
    $: stream = [...stream.slice(-11), data];
</script>

<div class="datastream">
    <div class="datastream__labels">
        {#each labels as label}
            <span>{label}</span>
        {/each}
    </div>
    {#each stream as row}
        <div class="datastream__data">
            {#each row as col}
                <span>{col}</span>
            {/each}
        </div>
    {/each}
</div>

<style lang="scss">
    .datastream {
        padding: 0 2rem;
        width: 100%;
        

        &__labels {
            font-size: var(--text-base);
            color: var(--color-grey-mid);
            display: flex;
            justify-content: space-around;
            margin-bottom: 0.5rem;
        }
        &__data {
            font-size: var(--text-sm);
            color: var(--color-grey-light);
            display: flex;
            justify-content: space-around;
            margin-bottom: 0.25rem;

            &:last-of-type {
                margin-bottom: 0;
            }
            & > span {
                min-width: 2rem;
                text-align: center;
            }
        }
    }
</style>