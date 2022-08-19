import PhemCache from './cache';

const sleepMs = (time: number) => new Promise(r => setTimeout(r, time));

describe('PhemCache', () => {

	beforeEach(() => {
		jest.useRealTimers();
	});
	
	it('should set and get values', () => {
		jest.useFakeTimers();
		const cache = PhemCache<string, string>();

		expect(cache.__cache.size).toBe(0);

		cache.set('test', '123');
		expect(cache.__cache.size).toBe(1);

		expect(cache.get('test')).toBe('123');
	});

	it('should run beforeClear and afterClear', () => {
		jest.useFakeTimers();

		const beforeClear = jest.fn();
		const afterClear = jest.fn();
		const cache = PhemCache<string, string>({
			beforeClear,
			afterClear,
		});

		cache.set('test', '123');

		jest.runAllTimers();

		expect(beforeClear).toHaveBeenCalledWith('test', '123');
		expect(afterClear).toHaveBeenCalledWith('test', '123');
	});

	it('should run afterClear even if no beforeClear defined', () => {
		jest.useFakeTimers();

		const afterClear = jest.fn();
		const cache = PhemCache<string, string>({
			afterClear,
		});

		cache.set('test', '123');

		jest.runAllTimers();

		expect(afterClear).toHaveBeenCalledWith('test', '123');
	});

	it('should be able to override clearing with beforeClear', () => {
		jest.useFakeTimers();

		const beforeClear = jest.fn();
		beforeClear.mockImplementation(() => false);
		const cache = PhemCache<string, string>({
			beforeClear,
		});

		cache.set('test', '123');

		jest.runOnlyPendingTimers();

		expect(beforeClear).toHaveBeenCalledWith('test', '123');
		expect(cache.get('test')).toBe('123');
	});

	it('should clear everything from cache', () => {
		const cache = PhemCache<string, string>();

		expect(cache.__cache.size).toBe(0);

		cache.set('test1', '123');
		cache.set('test2', '123');

		expect(cache.__cache.size).toBe(2);

		cache.clear();

		expect(cache.__cache.size).toBe(0);
	});

	it('should reset on set', async () => {
		const cache = PhemCache<string, string>({
			ttlMs: 100,
			resetOnSet: true,
			resetOnGet: false,
		});

		cache.set('test', '123');

		await sleepMs(95);
		expect(cache.get('test')).toBe('123');

		cache.set('test', '123');

		await sleepMs(95);
		expect(cache.get('test')).toBe('123');

		await sleepMs(20);
		expect(cache.get('test')).toBe(undefined);
	});

	it('should reset on get', async () => {
		const cache = PhemCache<string, string>({
			ttlMs: 100,
			resetOnSet: false,
			resetOnGet: true,
		});
		const __cache = cache.__cache;

		cache.set('test', '123');

		await sleepMs(90);
		expect(__cache.get('test').value).toBe('123');

		cache.get('test');

		await sleepMs(90);
		expect(__cache.get('test').value).toBe('123');

		await sleepMs(20);
		expect(__cache.get('test')).toBe(undefined);
	});

	it("should fail", () => {
		expect(1).toBe(2);
	})
});
