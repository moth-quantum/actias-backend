<script lang="ts">
	import { qubits, axes, activeQubitCount, isMeasuring } from '$lib/stores/qubits';
	import { redrawCables } from '$lib/stores/patching';
	import QubitPerform from './QubitPerform.svelte';
	import { debounce } from '$lib/utils/utils';
	import { getUserColour, getUserName } from '$lib/stores/users';
	import { isApp } from '$lib/stores/global';
	import { onMount } from 'svelte';
	
	let windowWidth: number;

	const handleScroll = debounce(() => redrawCables(), 1);

	const handleSliderChange = (e: CustomEvent, qubit: number, axis: number) => {
			axes[qubit].update(axes => {
					axes[axis] = e.detail;
					return axes;
			});
	}
	// $: isSingle = $activeQubitCount === 1 || windowWidth < 1500;
	// $: isDouble = $activeQubitCount%2 === 0 && windowWidth >= 1500;
	// $: isTriple = $activeQubitCount%3 === 0 && windowWidth >= 1500;
	// $: isQuadruple = $activeQubitCount >= 8 && $activeQubitCount != 9 && windowWidth >= 1500;
	// $: isFive = $activeQubitCount === 5 && windowWidth > 1500;
	// $: isSeven = $activeQubitCount === 7 && windowWidth > 1500;
	// $: isTen = $activeQubitCount === 10 && windowWidth > 1500;
	// $: isEleven = $activeQubitCount === 11 && windowWidth > 1500;
	// $: isTwelve = $activeQubitCount === 12 && windowWidth > 1500;

	// $: isFullHeight = ($activeQubitCount === 1 && windowWidth > 1000) 
	// 		|| ($activeQubitCount === 2 && windowWidth > 1000) || ($activeQubitCount === 3 && windowWidth > 1000);
	// $: isHalfHeight = ($activeQubitCount >= 4 && windowWidth >= 1500) && !isThirdHeight;
	// $: isThirdHeight = ($activeQubitCount >= 9 && windowWidth >= 1500);
	

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
					class="qubit qubit--{$activeQubitCount}"
					class:qubit--small-screen={windowWidth < 1500}
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
					margin-bottom: 1rem;

					&:last-child() {
							margin-bottom: 0;
					}
      }

      &--third-height {
          height: calc(33.3333% - 0.6666rem);
					margin-bottom: 1rem;
					&:last-child() {
							margin-bottom: 0;
					}
      }

			&--1, .qubit--small-screen {
				@extend .qubit--full-height;
				flex-basis: 100%;
			}

			&--2 {
				@extend .qubit--full-height;
				flex-basis: calc(50% - 0.5rem);
				margin-right: 1rem;
				&:last-child {
					margin-right: 0;
				}
			}

			&--3 {
				@extend .qubit--full-height;
				margin-right: 1rem;
				flex-basis: calc(33.33% - 0.75rem);

				&:last-child {
					margin-right: 0;
				}
			}

			&--4 {
				@extend .qubit--half-height;
				@extend .qubit--2;
				&:nth-child(2n) {
					margin-right: 0;
				}
			}

			&--5 {
				@extend .qubit--half-height;
				@extend .qubit--3;
				&:nth-child(1), &:nth-child(2) {
					flex-basis: calc(50% - 0.5rem);
				}
				&:nth-child(2) {
					margin-right: 0;
				}
			}

			&--6 {
				@extend .qubit--half-height;
				@extend .qubit--3;

				&:nth-child(3n) {
					margin-right: 0;
				}
			}

			&--6 {
				@extend .qubit--half-height;
				@extend .qubit--3;

				&:nth-child(3n) {
					margin-right: 0;
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