import { Client, type Message } from '@tmi.js/chat';

export class TwitchClient {
	private _client: Client;
	private _channel: string;

	constructor(channel: string) {
		this._channel = channel.toLowerCase();
		this._client = new Client({
			channels: [this._channel],
			token: undefined
		});
		this._client.on('error', (e) => {
			console.warn(e);
		});
		this._client.on('connect', () => {
			console.debug(`Connected to ${this._channel}`);
		});
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
		this._channel = channel;

		if (this._client.isConnected()) {
			console.debug(`leaving ${this._channel}`);
			this._client.part(this._channel);
			console.debug(`joining ${this._channel}`);
			this._client.join(channel);
		} else {
			this._client = new Client({
				channels: [channel],
				token: undefined
			});
		}
	}

	public close() {
		this._client.close();
	}

	public onMessage(handler: (data: Message.Event) => void) {
		this._client.on('message', (e) => {
			handler(e);
		});
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
