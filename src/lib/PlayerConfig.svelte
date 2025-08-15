<script lang="ts">
	import type { PlayerConfig } from '$lib/types';
	import { m } from '$lib/paraglide/messages';

	let {
		wins,
		player = $bindable(),
		configTwitchName = $bindable()
	}: { wins: number; player: PlayerConfig; configTwitchName?: string } = $props();
</script>

<div class="player-config">
	<div class="form-group">
		<label for="twitchName">{m.twitchName()}</label>
		<input
			type="text"
			id="twitchName"
			bind:value={player.twitchName}
			oninput={() => {
				player.displayName = player.twitchName;
				if (configTwitchName !== undefined) {
					configTwitchName = player.twitchName;
				}
			}}
		/>
	</div>

	<div class="form-group">
		<label for="displayName">{m.displayName()}</label>
		<input type="text" id="displayName" bind:value={player.displayName} />
	</div>

	<div class="form-group">
		<label for="color">{m.color()}</label>
		<input type="color" id="color" bind:value={player.color} />
	</div>

	<div class="form-group">
		<label for="startWins">{m.startWins()}</label>
		<input type="number" id="startWins" bind:value={player.startWins} min="0" max={wins - 1} />
	</div>
</div>

<style>
	.player-config {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 6px;
		background: #dedede;
	}

	.form-group {
		flex: 1 1;
		display: flex;
		flex-direction: column;
	}

	label {
		font-weight: 500;
		color: #555;
		margin-bottom: 0.25rem;
	}

	input {
		background-color: #f2f2f2;
		width: 100%;
		height: 100%;
		padding: 0.5rem;
		border: 0.1em solid #ccc;
		border-radius: 0.5em;
		font-size: 1rem;
		width: 100%;
		box-sizing: border-box;
	}

	input:focus {
		outline: none;
		border-color: #4a90e2;
		box-shadow: 0 0 0 0.1em #4a90e233;
	}
</style>
