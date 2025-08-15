<script lang="ts">
	import { encode } from '@msgpack/msgpack';
	import LZString from 'lz-string';
	import { page } from '$app/state';
	import PlayerConfig from './PlayerConfig.svelte';
	import type { Config } from '$lib/types';
	import { locales, setLocale } from '$lib/paraglide/runtime';
	import { m } from '$lib/paraglide/messages';

	const { config = $bindable() }: { config: Config } = $props();

	const configUrl = $derived.by(() => {
		const encoded = encode(config);
		const encodedString = String.fromCharCode(...encoded);
		const urlSafe = LZString.compressToEncodedURIComponent(encodedString);
		return `${page.url.origin}/config?c=${urlSafe}`;
	});

	$effect(() => {
		setLocale(config.language);
	});
</script>

<form>
	<div>
		<label for="theme">{m.theme()}</label>
		<select bind:value={config.theme}>
			<option value="light">{m.light_theme()}</option>
			<option value="dark">{m.dark_theme()}</option>
		</select>
	</div>

	<div>
		<label for="wins">{m.wins({ count: 2 })}</label>
		<input type="number" bind:value={config.wins} min="1" />
	</div>

	<div>
		<label for="language">{m.language()}</label>
		<select bind:value={config.language}>
			{#each locales as locale (locale)}
				<option value={locale}>{locale}</option>
			{/each}
		</select>
	</div>

	<div>
		<label for="layout">{m.layout()}</label>
		<select bind:value={config.layout}>
			<option value="horizontal">{m.horizontal()}</option>
			<option value="vertical">{m.vertical()}</option>
		</select>
	</div>

	<hr />

	<h3>Players</h3>
	<PlayerConfig
		wins={config.wins}
		bind:player={config.player1}
		bind:configTwitchName={config.configTwitchName}
	/>
	<PlayerConfig wins={config.wins} bind:player={config.player2} />

	<hr />

	<label for="configTwitchName">{m.configTwitchName()}</label>
	<input type="text" bind:value={config.configTwitchName} />

	<p class="overlay-url-container">
		<strong class="overlay-label">{m.generatedOverlayURL()}:</strong>
		<a href={configUrl} class="overlay-url" target="_blank">{configUrl}</a>
	</p>
</form>

<style>
	.overlay-url-container {
		display: flex;
		gap: 0.25rem;
	}

	.overlay-label {
		white-space: nowrap;
		flex-shrink: 0;
	}

	.overlay-url {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
