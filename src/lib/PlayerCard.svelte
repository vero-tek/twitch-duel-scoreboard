<script lang="ts">
	import type { PlayerState } from '$lib/types';
	import { m } from '$lib/paraglide/messages';

	const {
		state,
		playerConfig,
		totalWins
	}: {
		state: PlayerState;
		playerConfig: { displayName: string; color: string };
		totalWins: number;
	} = $props();
</script>

<div class="player" style="--score-color: {playerConfig.color}">
	<div class="player-header">
		{#if state.logo}
			<img src={state.logo} alt={playerConfig.displayName} class="player-logo" />
		{/if}
		<div class="player-name">{playerConfig.displayName}</div>
	</div>
	<div class="score-bar">
		<div class="score-fill" style="width: {(state.wins / totalWins) * 100}%"></div>
	</div>
	<div class="score-text">{state.wins} / {totalWins}</div>
	<div class="wins-needed">
		{totalWins - state.wins}
		{m.wins({ count: totalWins - state.wins })}
	</div>
</div>

<style>
	.player {
		display: flex;
		flex: 1 1 0;
		width: 100%;
		height: 100%;
		flex-direction: column;
		align-items: center;
		font-size: calc(1.5vw + 1.5vh);
	}

	.player-header {
		display: flex;
		align-items: center;
		gap: 0.5em;
		margin-bottom: 1vh;
	}

	.player-logo {
		width: calc(1.5vw + 1.5vh);
		border-radius: 50%;
		object-fit: cover;
		border: 0.07em solid #fff;
	}

	.player-name {
		font-weight: bold;
		font-size: 1em;
	}

	.score-bar {
		width: 90%;
		height: 4vh;
		background: #ccc;
		border-radius: 2vh;
		overflow: hidden;
		margin-bottom: 1vh;
	}

	.score-fill {
		height: 100%;
		background: linear-gradient(to left, var(--score-color), #ffffff);
		background-size: 225% 100%;
		background-position: right center;
		transition:
			background-position 0.3s ease,
			width 0.3s ease;
	}

	.score-text {
		font-size: 1em;
		margin-bottom: 1vh;
	}

	.wins-needed {
		font-size: 0.8em;
		color: #888888;
		text-align: center;
	}
</style>
