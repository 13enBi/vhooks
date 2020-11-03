import { useStore, useMutations, useState, useGetters } from '..';

describe('useStore', () => {
	test('useStore should be defined', () => {
		expect(useStore).toBeDefined();
		expect(useMutations).toBeDefined();
		expect(useState).toBeDefined();
		expect(useGetters).toBeDefined();
	});
});
