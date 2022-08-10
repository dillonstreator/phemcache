# phemcache

A configurable ephemeral in-memory cache with before and after clear hooks

## Installation

### npm
```bash
npm i phemcache
```

### yarn
```bash
yarn add phemcache
```

## Example

```javascript
const cache = PhemCache({
	ttlMS: 1000,
	resetOnSet: true,
	resetOnGet: true,
	beforeClear(key, value) {
		console.log(`global before clear ${key} ${value}`);

		// return false prevent the key from being cleared and restarting the ttl timer
		return Math.random() > 0.75;
	},
	afterClear(key, value) {
		console.log(`global after clear ${key} ${value}`);
	},
});

cache.set('key1', 1);

// override some global options for key2
cache.set('key2', 2, {
	resetOnSet: false,
});

// override all global options for key3
cache.set('key3', 3, {
	ttlMS: 500,
	resetOnGet: false,
	resetOnSet: false,
	beforeClear(key, value) {
		console.log(`overridden before clear ${key} ${value}`);
		return Math.random() > 0.5;
	},
	afterClear(key, value) {
		console.log(`overridden after clear ${key} ${value}`);
	},
});

// void or undefined return results in the key being cleared
cache.set('key4', 4, {
	beforeClear(key, value) {
		console.log(`before clear ${key} ${value}`);
	},
});

```

## Notes

- `beforeClear` does not support asynchronous operations