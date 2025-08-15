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

<h1>{m.configuration()}</h1>
<ConfigForm bind:config />

<h1>{m.livePreview()}</h1>
<Scoreboard {config} />
