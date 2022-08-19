<p align="center">
	<img src="./logo.svg" style="border-radius:50%;" />
</p>
<h1 align="center">phemcache</h1>
<p align="center">A configurable ephemeral in-memory cache</p>
<p align="center">
  <a aria-label="Test coverage" href="https://codecov.io/gh/dillonstreator/phemcache">
    <img alt="" src="https://codecov.io/gh/dillonstreator/phemcache/branch/main/graph/badge.svg?token=H63TLXZEBA">
  </a>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/phemcache">
    <img alt="" src="https://badgen.net/npm/v/phemcache">
  </a>
  <a aria-label="Package size" href="https://bundlephobia.com/result?p=phemcache">
    <img alt="" src="https://badgen.net/bundlephobia/minzip/phemcache">
  </a>
  <a aria-label="License" href="https://github.com/dillonstreator/phemcache/blob/main/LICENSE">
    <img alt="" src="https://badgen.net/npm/license/phemcache">
  </a>
  <a aria-label="Typescript" href="https://github.com/dillonstreator/phemcache/blob/main/src/cache.ts">
    <img alt="" src="https://badgen.net/npm/types/phemcache">
  </a>
  <a aria-label="CodeFactor" href="https://www.codefactor.io/repository/github/dillonstreator/phemcache">
    <img alt="" src="https://www.codefactor.io/repository/github/dillonstreator/phemcache/badge">
  </a>
</p>


## Installation

### npm
```bash
npm install phemcache
```

### yarn
```bash
yarn add phemcache
```

## Example

```javascript
import PhemCache from 'phemcache'

const cache = PhemCache({
	ttlMs: 1000,
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
	ttlMs: 500,
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