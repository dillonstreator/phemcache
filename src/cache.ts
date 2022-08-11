type PhemCacheOptions<K, V> = {
	resetOnSet?: boolean; // whether to reset the time to live when a key is set. default false
	resetOnGet?: boolean; // whether to reset the time to live when a key is retrieved. default false
	ttlMs?: number; // time to live (ttl) is the time in milliseconds before the key is cleared from the cache after being set. default 10 minutes
	beforeClear?: (key: K, value: V) => boolean | undefined | void; // access a key & value before they are cleared from the cache and optionally prevent clearing by returning false
	afterClear?: (key: K, value: V) => void; // access a key & value after they are cleared from the cache
};

interface PhemCacheValue<K, V> extends PhemCacheOptions<K, V> {
	value: V;

	timeout: ReturnType<typeof setTimeout>;
}

const PhemCache = <K, V>({
	resetOnGet = false,
	resetOnSet = false,
	ttlMs = 1000 * 60 * 10,
	beforeClear,
	afterClear,
}: PhemCacheOptions<K, V> = {}) => {
	const cache = new Map<K, PhemCacheValue<K, V>>();

	const createTimeout = (key: K, timeout: number) =>
		setTimeout(() => {
			if (!cache.has(key)) return;

			const got = cache.get(key)!;
			const _beforeClear = got.beforeClear ?? beforeClear;
			const _afterClear = got.afterClear ?? afterClear;
			if (!_beforeClear) {
				cache.delete(key);
				if (_afterClear) _afterClear(key, got.value);

				return;
			}

			const beforeClearResult = _beforeClear(key, got.value);
			const shouldClear = beforeClearResult || beforeClearResult === undefined;

			if (shouldClear) {
				cache.delete(key);
				if (_afterClear) _afterClear(key, got.value);
			} else {
				cache.set(key, {
					timeout: createTimeout(key, timeout),
					value: got.value,
				});
			}
		}, timeout);

	const clear = () => {
		cache.forEach((v) => clearTimeout(v.timeout));
		cache.clear();
	};

	return {
		get: (key: K) => {
			const got = cache.get(key);
			if (!got) return;

			if (got.resetOnGet ?? resetOnGet) {
				clearTimeout(got.timeout);
				got.timeout = createTimeout(key, got.ttlMs ?? ttlMs);
			}

			return got.value;
		},
		set: (key: K, value: V, opts: PhemCacheOptions<K, V> = {}) => {
			const got = cache.get(key);

			let timeout: PhemCacheValue<K, V>['timeout'];
			const _ttlMs = opts.ttlMs ?? got?.ttlMs ?? ttlMs;
			const _resetOnSet = opts.resetOnSet ?? got?.resetOnSet ?? resetOnSet;

			if (got) {
				if (got.resetOnSet ?? resetOnSet) {
					clearTimeout(got.timeout);
					timeout = createTimeout(key, _ttlMs);
				} else {
					timeout = got.timeout;
				}
			} else {
				timeout = createTimeout(key, _ttlMs);
			}

			cache.set(key, {
				timeout,
				value,
				resetOnGet: opts.resetOnGet ?? got?.resetOnGet ?? resetOnGet,
				resetOnSet: _resetOnSet,
				ttlMs: _ttlMs,
				beforeClear: opts.beforeClear ?? got?.beforeClear ?? beforeClear,
				afterClear: opts.afterClear ?? got?.afterClear ?? afterClear,
			});
		},
		clear,
		__cache: cache,
	};
};

export default PhemCache;
