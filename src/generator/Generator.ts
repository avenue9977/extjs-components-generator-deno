import * as path from 'jsr:@std/path'
import * as ejs from 'npm:ejs'
import { COMPONENT_TYPE, VIEW_CONFIG_OPTION } from '../component/Component.ts'
import Template, { TemplateData } from '../templates/Template.ts'

export default class Generator {
	constructor(private template: Template) {}

	public createComponentFiles() {
		const templatesPath = this.template.getPath()
		const generatedFilesPath = path.join(
			Deno.cwd(),
			this.template.component.location,
		)
		const filesToCreate = Deno.readDirSync(templatesPath)

		// Check if the dir you try to write in exists
		Deno.mkdirSync(generatedFilesPath, { recursive: true })

		for (const file of filesToCreate) {
			const templatePath = `${templatesPath}/${file.name}` // Get the path of the template file
			const templateExtension = path.extname(file.name) // Get the current file extension
			const templateName = path.basename(file.name, templateExtension) // Get the current file name
			const stats = Deno.statSync(templatePath) // Get stats about the current file

			// Check if the `View` needs `Controller`, `ViewModel` or `Styles`
			if (
				this.template.component.type === COMPONENT_TYPE.VIEW &&
				templateName.toLowerCase() !== COMPONENT_TYPE.VIEW &&
				!this.template.component.getViewConfig()
					?.[templateName as VIEW_CONFIG_OPTION]
			) continue

			if (stats.isFile) {
				let fileName = this.template.component.name

				if (
					templateName === VIEW_CONFIG_OPTION.CONTROLLER ||
					templateName === VIEW_CONFIG_OPTION.VIEW_MODEL
				) fileName = this.template.component.name + templateName

				const writePath = `${generatedFilesPath}/${fileName + templateExtension}`
				const decoder = new TextDecoder('utf-8')

				// Read the template file and transform its contents using template engine
				const templateContents = Deno.readFileSync(templatePath)
				const templateData = this.template.getData()
				const fileContents = this.render(
					decoder.decode(templateContents),
					templateData,
				)

				const encoder = new TextEncoder()
				const data = encoder.encode(fileContents)
				// Create the file into the selected directory if it don't exist
				Deno.writeFileSync(writePath, data, {
					create: true,
					mode: 777,
				})
			}
		}
	}

	private render(content: string, data: TemplateData) {
		return ejs.render(content, data)
	}
}
