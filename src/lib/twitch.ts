import { Client, type Message } from '@tmi.js/chat';

export class TwitchClient {
	private _client: Client;
	private _channel: string;
	private _messageHandlers: ((data: Message.Event) => void)[];

	constructor(channel: string) {
		this._channel = channel.toLowerCase();
		this._messageHandlers = [];
		this._client = TwitchClient.setupClient(this._channel);
	}

	protected static setupClient(channel: string) {
		const client = new Client({
			channels: [channel],
			token: undefined
		});
		client.on('error', (e) => {
			console.warn(e);
		});
		client.on('connect', () => {
			console.debug(`Connected to ${channel}`);
		});
		return client;
	}

	public connect() {
		if (!this._client.isConnected()) {
			this._client.connect();
		}
	}

	public get channel() {
		return this._channel;
	}

	public set channel(channel: string) {
		if (this._channel === channel) {
			return;
		}

		this._channel = channel;

		this.close();
		this._client = TwitchClient.setupClient(this._channel);
		this._messageHandlers.forEach((h) => this.startMessageHandler(h));
		this.connect();
	}

	public close() {
		this._client.close();
	}

	private startMessageHandler(handler: (data: Message.Event) => void) {
		this._client.on('message', handler);
	}

	public onMessage(handler: (data: Message.Event) => void) {
		this._messageHandlers.push(handler);
		this.startMessageHandler(handler);
	}
}

export async function fetchProfile(username: string): Promise<string | null> {
	try {
		const res = await fetch(`https://api.ivr.fi/v2/twitch/user?login=${username}`);
		const data = await res.json();
		if (!Array.isArray(data) || data.length != 1) {
			console.info('Failed to fetch Twitch profiles: Unexpected response');
			return null;
		}

		const profile = data[0];
		return profile ? (profile.logo ?? null) : null;
	} catch (err) {
		console.info('Failed to fetch Twitch profiles:', err);
		return null;
	}
}
