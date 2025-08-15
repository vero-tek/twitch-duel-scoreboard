<script lang="ts">
	import type { PlayerConfig } from '$lib/types';
	import { m } from '$lib/paraglide/messages';
	let {
		wins,
		player = $bindable(),
		configTwitchName = $bindable()
	}: { wins: number; player: PlayerConfig; configTwitchName?: string } = $props();
</script>

<div>
	<label for="twitchName">{m.twitchName()}</label>
	<input
		type="text"
		bind:value={player.twitchName}
		oninput={() => {
			player.displayName = player.twitchName;
			if (configTwitchName !== undefined) {
				configTwitchName = player.twitchName;
			}
		}}
	/>

	<label for="displayName">{m.displayName()}</label>
	<input type="text" bind:value={player.displayName} />

	<label for="color">{m.color()}</label>
	<input type="color" bind:value={player.color} />

	<label for="startWins">{m.startWins()}</label>
	<input type="number" bind:value={player.startWins} min="0" max={wins - 1} />
</div>
