import type { Locale } from '$lib/paraglide/runtime';

export interface PlayerConfig {
	displayName: string;
	twitchName: string;
	color: string;
	startWins: number;
}

export interface PlayerState {
	logo: string | null;
	wins: number;
	playerConfig: PlayerConfig;
}

export interface Config {
	theme: 'light' | 'dark';
	layout: 'horizontal' | 'vertical';
	language: Locale;
	wins: number;
	configTwitchName: string;
	player1: PlayerConfig;
	player2: PlayerConfig;
}
