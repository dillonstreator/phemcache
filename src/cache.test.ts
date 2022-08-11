import PhemCache from './cache';

describe('PhemCache', () => {
	it('should set and get values', () => {
		jest.useFakeTimers();
		const cache = PhemCache<string, string>();

		expect(cache.__cache.size).toBe(0);

		cache.set('test', '123');
		expect(cache.__cache.size).toBe(1);

		expect(cache.get('test')).toBe('123');
	});
});
