<script lang="ts">
	import Scoreboard from '$lib/Scoreboard.svelte';
	import type { Config } from '$lib/types';
	import ConfigForm from '$lib/ConfigForm.svelte';
	import { getLocale } from '$lib/paraglide/runtime';
	import { m } from '$lib/paraglide/messages';

	let config: Config = $state({
		theme: 'dark',
		language: getLocale(),
		wins: 100,
		layout: 'horizontal',
		configTwitchName: 'ninja',
		player1: {
			twitchName: 'ninja',
			displayName: 'Ninja',
			color: '#0000ff',
			startWins: 0
		},
		player2: {
			twitchName: 'xqc',
			displayName: 'xQc',
			color: '#d8031c',
			startWins: 0
		}
	});
</script>

<main>
	<h1>{m.configuration()}</h1>
	<ConfigForm bind:config />

	<h2>{m.livePreview()}</h2>
	<div class="preview-container">
		<Scoreboard {config} />
	</div>
</main>

<style>
	main {
		margin: 1em;
	}

	h1,
	h2 {
		text-align: center;
	}

	.preview-container {
		padding: 0 5vw;
	}
</style>
