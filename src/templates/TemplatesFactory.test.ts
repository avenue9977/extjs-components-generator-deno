import { expect } from 'jsr:@std/expect';
import { join } from 'jsr:@std/path';
import { describe, it } from 'jsr:@std/testing/bdd';
import TemplatesFactory from './TemplatesFactory.ts';

describe('TemplatesFactory', () => {
	const path = join(
		import.meta.dirname ?? '',
		'..',
		'resources',
		'templates',
	);
	const templatesFactory = new TemplatesFactory(path);

	it('gets the pathName property', () => {
		expect(templatesFactory.pathName).toBe(path);
	});

	it('gets the component options', async () => {
		const result = await templatesFactory.getComponentOptions();
		expect(result).toEqual(['mixin', 'model', 'view', 'store']);
	});

	it('fails to gets the component options', async () => {
		templatesFactory.pathName = 'templates';
		try {
			await templatesFactory.getComponentOptions();
		} catch (error: any) {
			expect(error).toBeInstanceOf(Error);
			expect(error.message).toBe('Could not find template directory');
		}
	});
});
