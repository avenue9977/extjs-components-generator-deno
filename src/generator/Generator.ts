import * as path from "jsr:@std/path";
import * as ejs from 'npm:ejs';
import { Component, COMPONENT_TYPE, VIEW_CONFIG_OPTION } from '../component/Component.ts'

interface TemplateData {
    xtype: string
    module: string,
    name: string,
    location: string,
    modelName?: string,
    controller?: boolean,
    viewModel?: boolean,
    userCls?: string
}

export class Generator {
    constructor(private component: Component) {}

    private static createTemplateLocationString(input: string): string {
        const temp: string[] = [];
        const length = input.length;

        for (let i = 0; i <= length; i++) {
            // Remove the first and last '/'
            if (input.charCodeAt(i) === 47) {
                if (i === 0 || i === length - 1 || i === 4) continue;

                temp.push('.');
                continue;
            }

            // Remove the 'app' sub-string
            if (i === 1 && input.charCodeAt(i) === 97) continue; // Remove the starting 'a' char
            if (i === 2 || i === 3 && input.charCodeAt(i) === 112) continue; // Remove the starting 'p' char

            temp.push(input[i]);
        }

        return temp.join('');
    }

    private render(content: string, data: TemplateData) {
        return ejs.render(content, data);
    }

    public createComponentFiles() {
        const templatesPath = this.component.getTemplatePath();
        const pathToGenerate = path.join(Deno.cwd(), this.component.location);

        const filesToCreate = Deno.readDirSync(templatesPath);

        // Check if the dir you try to write in exists
        Deno.mkdirSync(pathToGenerate, {recursive: true});

        for (const file of filesToCreate) {
            const templatePath = `${templatesPath}/${file.name}`; // Get the path of the template file
            const templateExtension = path.extname(file.name); // Get the current file extension
            const templateName = path.basename(file.name, templateExtension); // Get the current file name
            const stats = Deno.statSync(templatePath); // Get stats about the current file

            // Check if the `View` needs `Controller`, `ViewModel` or `Styles`
            if (this.component.type === COMPONENT_TYPE.VIEW && templateName.toLowerCase() !== COMPONENT_TYPE.VIEW && !this.component.getViewConfig()?.[templateName as VIEW_CONFIG_OPTION]) continue;

            if (stats.isFile) {
                let fileName = this.component.name;

                if (templateName === VIEW_CONFIG_OPTION.CONTROLLER || templateName === VIEW_CONFIG_OPTION.VIEW_MODEL) fileName = this.component.name + templateName;

                const writePath = `${pathToGenerate}/${fileName + templateExtension}`;
                const decoder = new TextDecoder("utf-8");

                // Read the template file and transform its contents using template engine
                const templateContents = Deno.readFileSync(templatePath);
                const templateData = this.getTemplateData();
                const fileContents = this.render(decoder.decode(templateContents), templateData);

                const encoder = new TextEncoder();
                const data = encoder.encode(fileContents);
                // Create the file into the selected directory if it don`t exists
                Deno.writeFileSync(writePath, data, {
                    create: true,
                    mode: 777
                });
            }
        }
    }

    private getTemplateData(): TemplateData {
        const data: TemplateData = {
            xtype: this.component.name.charAt(0).toLowerCase() + this.component.name.slice(1),
            name: this.component.name,
            module: this.getTemplateModule(),
            location: Generator.createTemplateLocationString(this.component.location),
            userCls: ''
        };

        if (this.component.type === COMPONENT_TYPE.VIEW) {
            const viewConfig = this.component.getViewConfig()
            data.controller = viewConfig?.controller;
            data.viewModel = viewConfig?.viewModel;

            if (viewConfig?.styles) {
                // Create the `user-class-with-component-name`
                data.userCls = this.component.name.split(/(?=[A-Z])/g).map(string => string.toLowerCase()).join('-');
            }
        }

        if (this.component.type === COMPONENT_TYPE.STORE) {
            if (this.component.name.endsWith('s')) {
                // Remove the ending `s` to construct the Model name
                data.modelName = this.component.name.slice(0, this.component.name.length - 1);
            } else {
                throw new Error('Store name must be plural! Example: Products');
            }
        }

        return data;
    }

    private getTemplateModule(): string {
        return this.component.location.split('/')[3];
    }
}
