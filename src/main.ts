import { parseArgs } from '@std/cli'
import * as path from 'jsr:@std/path'
import Component, { COMPONENT_TYPE } from './component/Component.ts'
import ComponentValidator from './component/ComponentValidator.ts'
import Generator from './generator/Generator.ts'
import Template from './templates/Template.ts'

if (import.meta.main) {
	const { name: appName } = parseArgs(Deno.args, {
		string: ['name', 'n'],
		alias: {
			name: ['name', 'n'],
		},
		default: {
			name: 'app',
		},
	})
	const dirname = path.dirname(path.fromFileUrl(import.meta.url))
	const templatesDirectoryPath = path.join(dirname, 'resources', 'templates')

	const validator = new ComponentValidator()
	const component = new Component(appName, validator)

	await component.selectType()
	await component.askName()
	await component.askLocation()

	if (component.type === COMPONENT_TYPE.VIEW) {
		await component.confirmController()
		await component.confirmViewModel()
		await component.confirmStyles()
	}

	const template = new Template(templatesDirectoryPath, component)
	const generator = new Generator(template)

	generator.createComponentFiles()

	console.log('Component created successfully.')

	Deno.exit(0)
}
