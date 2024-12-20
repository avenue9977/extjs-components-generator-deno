import { join } from 'jsr:@std/path'
import Component, { COMPONENT_TYPE } from '../component/Component.ts'

export type TemplateData = {
	xtype: string
	module: string
	name: string
	location: string
	modelName?: string
	controller?: boolean
	viewModel?: boolean
	userCls?: string
}

export default class Template {
	constructor(
		public templatesDirectoryPath: string,
		public component: Component,
	) {}

	public getPath(): string {
		return join(this.templatesDirectoryPath, this.component.type)
	}

	getData(): TemplateData {
		const data: TemplateData = {
			xtype: this.component.name.charAt(0).toLowerCase() +
				this.component.name.slice(1),
			name: this.component.name,
			module: this.getTemplateModule(),
			location: this.createTemplateLocationString(
				this.component.location,
			),
			userCls: '',
		}

		if (this.component.type === COMPONENT_TYPE.VIEW) {
			const viewConfig = this.component.getViewConfig()
			data.controller = viewConfig?.controller
			data.viewModel = viewConfig?.viewModel

			if (viewConfig?.styles) {
				// Create the `user-class-with-component-name`
				data.userCls = this.component.name.split(/(?=[A-Z])/g).map(
					(string) => string.toLowerCase(),
				).join('-')
			}
		}

		if (this.component.type === COMPONENT_TYPE.STORE) {
			if (this.component.name.endsWith('s')) {
				// Remove the ending `s` to construct the Model name
				data.modelName = this.component.name.slice(0, this.component.name.length - 1)
			} else {
				throw new Error('Store name must be plural! Example: Products')
			}
		}

		return data
	}

	private getTemplateModule(): string {
		return this.component.location.split('/')[3]
	}

	private createTemplateLocationString(input: string): string {
		const temp: string[] = []
		const length = input.length

		for (let i = 0; i <= length; i++) {
			// Remove the first and last '/'
			if (input.charCodeAt(i) === 47) {
				if (i === 0 || i === length - 1 || i === 4) continue

				temp.push('.')
				continue
			}

			// Remove the 'app' sub-string
			if (i === 1 && input.charCodeAt(i) === 97) continue // Remove the starting 'a' char
			if (i === 2 || i === 3 && input.charCodeAt(i) === 112) continue // Remove the starting 'p' char

			temp.push(input[i])
		}

		return temp.join('')
	}
}
