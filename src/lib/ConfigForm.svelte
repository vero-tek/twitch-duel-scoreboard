<script lang="ts">
	import { encode } from '@msgpack/msgpack';
	import LZString from 'lz-string';
	import { page } from '$app/state';
	import PlayerConfig from './PlayerConfig.svelte';
	import type { Config } from '$lib/types';
	import { locales, setLocale } from '$lib/paraglide/runtime';
	import { m } from '$lib/paraglide/messages';
	import { resolve } from '$app/paths';

	const { config = $bindable() }: { config: Config } = $props();

	const configPath = $derived.by(() => {
		const encoded = encode(config);
		const encodedString = String.fromCharCode(...encoded);
		const urlSafe = LZString.compressToEncodedURIComponent(encodedString);
		return `${resolve('/config')}?c=${urlSafe}`;
	});

	$effect(() => {
		setLocale(config.language);
	});
</script>

<form class="config-form">
	<fieldset>
		<legend>{m.generalSettings()}</legend>

		<div class="form-group">
			<label for="theme">{m.theme()}</label>
			<select id="theme" bind:value={config.theme}>
				<option value="light">{m.light_theme()}</option>
				<option value="dark">{m.dark_theme()}</option>
			</select>
		</div>

		<div class="form-group">
			<label for="wins">{m.wins({ count: 2 })}</label>
			<input type="number" id="wins" bind:value={config.wins} min="1" />
		</div>

		<div class="form-group">
			<label for="language">{m.language()}</label>
			<select id="language" bind:value={config.language}>
				{#each locales as locale (locale)}
					<option value={locale}>{locale}</option>
				{/each}
			</select>
		</div>

		<div class="form-group">
			<label for="layout">{m.layout()}</label>
			<select id="layout" bind:value={config.layout}>
				<option value="horizontal">{m.horizontal()}</option>
				<option value="vertical">{m.vertical()}</option>
			</select>
		</div>
	</fieldset>

	<fieldset class="players">
		<legend>{m.players()}</legend>
		<PlayerConfig
			wins={config.wins}
			bind:player={config.player1}
			bind:configTwitchName={config.configTwitchName}
		/>
		<PlayerConfig wins={config.wins} bind:player={config.player2} />
	</fieldset>

	<fieldset>
		<legend>{m.overlaySettings()}</legend>
		<div class="form-group">
			<label for="configTwitchName">{m.configTwitchName()}</label>
			<input type="text" id="configTwitchName" bind:value={config.configTwitchName} />
		</div>
	</fieldset>

	<fieldset>
		<legend>{m.generatedOverlayURL()}</legend>

		<div class="form-group">
			<label for="overlayUrl">{m.generatedOverlayURL()}</label>
			<a href={configPath} class="overlay-url" target="_blank"
				>{`${page.url.origin}${configPath}`}</a
			>
		</div>
		<div class="form-group">
			<label for="usage">{m.usage()}</label>
			<p>{m.usageText()}</p>
		</div>
	</fieldset>
</form>

<style>
	.config-form {
		margin: 1rem;
		padding: 1.5rem;
		background: #fbfbfb;
		border: 1px solid #ddd;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		font-family: system-ui, sans-serif;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	fieldset {
		background: #eeeeee;
		padding: 1rem 1.25rem;
		border: 1px solid #ccc;
		border-radius: 6px;
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	legend {
		padding: 0 0.5rem;
		font-weight: 600;
		color: #333;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		flex: 1 1;
	}

	label {
		margin-bottom: 0.25rem;
		font-weight: 500;
		color: #555;
	}

	input,
	select {
		background-color: #fcfcfc;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
		width: 100%;
		box-sizing: border-box;
	}

	input:focus,
	select:focus {
		outline: none;
		border-color: #4a90e2;
		box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
	}

	.overlay-url {
		max-width: 40vw;
		overflow: hidden;
		text-overflow: ellipsis;
		text-decoration: none;
	}
	.overlay-url:hover {
		text-decoration: underline;
	}

	.players {
		flex-direction: column;
	}
</style>
