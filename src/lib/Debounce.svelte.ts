import { onDestroy } from 'svelte';

export function debounce<T>(
	getValue: () => T,
	callback: (value: T) => Promise<void> | void,
	delay = 2000
) {
	let timeout: ReturnType<typeof setTimeout>;
	let initialized = false;

	$effect(() => {
		const value = getValue();

		if (value === undefined || value === null) return;

		if (!initialized) {
			initialized = true;
			callback(value);
			return;
		}

		clearTimeout(timeout);
		timeout = setTimeout(async () => {
			await callback(value);
		}, delay);
	});

	onDestroy(() => clearTimeout(timeout));
}
