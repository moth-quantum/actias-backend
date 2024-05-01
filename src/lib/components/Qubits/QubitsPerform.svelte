<script lang="ts">
	import { qubits, axes, activeQubitCount, isMeasuring } from '$lib/stores/qubits';
	import { redrawCables } from '$lib/stores/patching';
	import QubitPerform from './QubitPerform.svelte';
	import { debounce } from '$lib/utils/utils';
	import { getUserColour, getUserName } from '$lib/stores/users';
	import { isApp } from '$lib/stores/global';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	
	let axesIds = ['x', 'y', 'z'];
	let axesNames = ['λ', 'φ', 'θ'];
	let windowWidth: number;

	const handleScroll = debounce(() => redrawCables(), 1);

	const handleSliderChange = (e: CustomEvent, qubit: number, axis: number) => {
			axes[qubit].update(axes => {
					axes[axis] = e.detail;
					return axes;
			});
	}
	$: isSingle = $activeQubitCount === 1 || windowWidth < 1500;
	$: isDouble = $activeQubitCount%2 === 0 && windowWidth >= 1500;
	$: isTriple = $activeQubitCount%3 === 0 && windowWidth >= 1500;
	$: isQuadruple = $activeQubitCount >= 8 && $activeQubitCount != 9 && windowWidth >= 1500;
	$: isFive = $activeQubitCount === 5 && windowWidth > 1500;
	$: isSeven = $activeQubitCount === 7 && windowWidth > 1500;
	$: isEleven = $activeQubitCount === 11 && windowWidth > 1500;

	$: isFullHeight = ($activeQubitCount === 1 && windowWidth > 1000) 
			|| ($activeQubitCount === 2 && windowWidth > 1000) || ($activeQubitCount === 3 && windowWidth > 1000);
	$: isHalfHeight = ($activeQubitCount >= 4 && windowWidth >= 1500) && !isThirdHeight;
	$: isThirdHeight = ($activeQubitCount >= 9 && windowWidth >= 1500);

	onMount(() => {
			windowWidth = window.innerWidth;
	});

</script>

<svelte:window on:resize={() => windowWidth = window.innerWidth} />

<div 
	class="qubits"
	on:scroll={() => handleScroll()}
>
	{#each $qubits.filter(q => q.active) as qubit, i}
			<div 
					class="qubit"
					class:qubit--single={isSingle || windowWidth < 1500}
					class:qubit--double={isDouble && windowWidth > 1500}
					class:qubit--triple={isTriple && windowWidth > 1500}
					class:qubit--four={isQuadruple && windowWidth > 1500}
					class:qubit--five={isFive && windowWidth > 1500}
					class:qubit--seven={isSeven && windowWidth > 1500}
					class:qubit--full-height={isFullHeight}
					class:qubit--half-height={isHalfHeight}
					class:qubit--third-height={isThirdHeight}
					class:qubit--border={qubit.user !== 'you'}
					style="border-color: {getUserColour(qubit.user)};"

			>
					{#if isApp()}
							<h3 class="qubit__info">
									<span style="background-color: {getUserColour(qubit.user)}">{(i + 1).toString().padStart(2, '0')}</span>
									<span style="background-color: {getUserColour(qubit.user)}">{getUserName(qubit.user)}</span>
							</h3>
					{:else}
							<h3 class="qubit__info">
									<span style="border: 1px solid #FEF4E5; color: #FEF4E5;
									">{(i + 1).toString().padStart(2, '0')}</span>
							</h3>
					{/if}
					<div class="qubit__qubit">
							<QubitPerform 
									number={i}
									axes={axes[i]}
									disabled={qubit.user !== 'you' || $isMeasuring}
							/>
					</div>
			</div>
	{/each}
</div>


<style lang="scss">
	.qubits {
			width: 100%;
			height: 100%;
			overflow-y: scroll;
			display: flex;
			flex-wrap: wrap;
			@media (max-width: 1200px) {
					padding: 1rem 1rem 0;
			}
	}

	.qubit {
      position: relative;
      box-sizing: border-box;
      background-color: var(--color-grey-dark);
      display: grid;
      gap: 1rem;
      grid-template-rows: 1fr;
      grid-template-columns: 1fr;
      border-radius: 10px;

      &--full-height {
          height: 100%;
      }

      &--half-height {
          height: calc(50% - 0.5rem);

      }

      &--third-height {
          height: calc(33.3333% - 0.6666rem);
          margin-bottom: 1rem;
      }

      &--single {
          flex-basis: 100%;
          margin-bottom: 1rem;
          &:nth-last-of-type(1) {
              margin-bottom: 0;
          }
      }

      &--double {
          flex-basis: calc(50% - 0.5rem);
          margin-bottom: 1rem;
          &:nth-child(2n) {
              margin-left: 1rem;
          }
      }

      &--triple {
          flex-basis: calc(33.33% - 1rem);
          &:nth-child(n) {
            margin-right: 1rem;
            margin-left: 0;
          }
          &:nth-child(2) {
            margin-right: 1rem;
            margin-left: 0;
          }
          &:nth-child(3n) {
            margin-right: 0;
          }
      }

      &--four {
        flex-basis: calc(25% - 0.75rem);
        &:nth-child(2) {
            margin-right: 1rem;
        }
        &:nth-child(6) {
            margin-right: 1rem;
        }
      }
      &--five {
        flex-basis: calc(33.3333% - 0.6666rem);
        margin-right: 1rem;
        margin-bottom: 1rem;
        &:nth-child(1) {
            flex-basis: calc(50% - 0.5rem);
        }
        &:nth-child(2) {
            flex-basis: calc(50% - 0.5rem);
            margin-right: 0rem;
        }
        &:nth-child(5n) {
            margin-right: 0;
        }
      }

      &--seven {
          flex-basis: calc(25% - 0.75rem);
          margin-bottom: 1rem;

          &:nth-child(1) {
              margin-left: 0;
              margin-right: 1rem;
          }

          &:nth-child(2),
          &:nth-child(3) {
              margin-right: 1rem;
          }

          &:nth-child(5),
          &:nth-child(6),
          &:nth-child(7) {
              flex-basis: calc(33.3333% - 0.75rem);
              margin-right: 1rem;
          }

          &:nth-child(7) {
              margin-right: 0;
              margin-left: 0;
          }
      }

			&__info {
					position: absolute;
					top: 1.5rem;
					left: 2rem;
					z-index: 10;
					& span {
							text-align: center;
							padding: 0.5rem 1rem;
							background-color: var(--color-grey-darker);
							border-radius: 20px;
							margin-right: 0.5rem;
							font-weight: bold;
							color: var(--color-grey-darker);
					}
			}

			&__qubit {
					grid-row: 1;
					grid-column: 1;
					display: flex;
					align-items: center;
					justify-content: center;
					overflow: hidden;
			}   
	}
</style>