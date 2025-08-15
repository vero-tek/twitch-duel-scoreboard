<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { Config, PlayerState } from '$lib/types';
	import { debounce } from '$lib/Debounce.svelte';
	import PlayerCard from './PlayerCard.svelte';
	import { fetchProfile, TwitchClient } from './twitch';
	import { setLocale } from './paraglide/runtime';

	const { config }: { config: Config } = $props();

	$effect(() => setLocale(config.language));

	const player1State: PlayerState = $state({
		wins: config.player1.startWins,
		logo: null,
		playerConfig: config.player1
	});
	$effect(() => {
		player1State.wins = config.player1.startWins;
	});

	const player2State: PlayerState = $state({
		wins: config.player2.startWins,
		logo: null,
		playerConfig: config.player2
	});
	$effect(() => {
		player2State.wins = config.player2.startWins;
	});

	let client: TwitchClient = new TwitchClient(config.configTwitchName);

	debounce(
		() => config.player1.twitchName,
		async () => {
			await updateProfilePicture(player1State);
		}
	);
	debounce(
		() => config.player2.twitchName,
		async () => {
			await updateProfilePicture(player2State);
		}
	);

	debounce(
		() => config.configTwitchName,
		(channel) => {
			client.channel = channel;
		}
	);

	client.onMessage((e) => {
		const { user, message } = e;
		if (!user.isBroadcaster && !user.isMod) {
			return;
		}

		const textLower = message.text.trim().toLowerCase();
		if (textLower == '!sb win') {
			setScore(player1State, player1State.wins + 1);
		} else if (textLower == '!sb lose') {
			setScore(player2State, player2State.wins + 1);
		} else if (textLower.startsWith('!sb set')) {
			const words = textLower.split(' ');
			if (words.length == 3) {
				const score = words[2];
				const scores = score.split('/');
				try {
					setScore(player1State, parseInt(scores[0]));
					setScore(player2State, parseInt(scores[1]));
				} catch (err) {
					console.warn(err);
				}
			}
		}
	});
	client.connect();

	onDestroy(() => {
		client.close();
	});

	function setScore(playerState: PlayerState, wins: number) {
		if (wins > config.wins || wins < 0) {
			console.warn(`Cannot set wins to ${wins}`);
		} else {
			playerState.wins = wins;
		}
	}

	async function updateProfilePicture(playerState: PlayerState) {
		playerState.logo = await fetchProfile(playerState.playerConfig.twitchName);
	}
</script>

<div
	class={`scoreboard ${config.theme}`}
	style="flex-direction: {config.layout === 'horizontal' ? 'row' : 'column'};"
>
	<PlayerCard state={player1State} playerConfig={config.player1} totalWins={config.wins} />
	<div class="vs">VS</div>
	<PlayerCard state={player2State} playerConfig={config.player2} totalWins={config.wins} />
</div>

<style>
	.scoreboard {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		gap: 2vw;
		border-radius: 2vh;
		padding: 2vh 2vw;
		box-sizing: border-box;
	}
	.scoreboard.light {
		background: #f0f0f0;
		color: #111;
	}
	.scoreboard.dark {
		background: #222;
		color: #eee;
	}

	.vs {
		font-weight: bold;
		font-size: calc(2vw + 2vh);
		margin: 0 2vw;
	}

	.scoreboard[style*='column'] .vs {
		margin: 2vh 0;
	}
</style>
