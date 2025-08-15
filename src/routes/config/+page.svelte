<script lang="ts">
	import { decode } from '@msgpack/msgpack';
	import Scoreboard from '$lib/Scoreboard.svelte';
	import type { Config } from '$lib/types';
	import LZString from 'lz-string';
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	let config: Config | null = null;

	onMount(() => {
		const encodedConfig = page.url.searchParams.get('c');

		if (encodedConfig) {
			try {
				const binary = LZString.decompressFromEncodedURIComponent(encodedConfig);
				const bytes = new Uint8Array(binary.length);
				for (let i = 0; i < binary.length; i++) {
					bytes[i] = binary.charCodeAt(i);
				}
				config = decode(bytes) as Config;
			} catch (err) {
				console.error('Failed to decode config:', err);
			}
		} else {
			console.error('No config provided');
		}
	});
</script>

{#if config}
	<Scoreboard {config} />
{:else}
	<p>No config provided or failed to decode</p>
{/if}
