import * as path from "jsr:@std/path";
import * as ejs from 'npm:ejs';
import { Component } from '../component/Component.ts'

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

    constructor(
        private component: Component,
        private type: string,
        private name: string,
        private location: string,
        private viewConfiguration: Map<string, boolean>
    ) {
        console.log(component)
    }

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

        const templatesPath = this.getTemplatesPath();
        const currentDir = path.dirname(path.fromFileUrl(import.meta.url));
        const pathToInsert = path.join(currentDir,  this.location);

        let filesToCreate = Deno.readDirSync(templatesPath);

        // Check if the dir you try to write in exists
        Deno.mkdirSync(pathToInsert, {recursive: true});

        for (const file of filesToCreate) {
            const templatePath = `${templatesPath}/${file.name}`; // Get the path of the template file
            const templateExtension = path.extname(file.name); // Get the current file extension
            const templateName = path.basename(file.name, templateExtension); // Get the current file name
            const stats = Deno.statSync(templatePath); // Get stats about the current file

            // Check if the `View` needs `Controller`, `ViewModel` or `Styles`
            if (this.type.toLowerCase() === 'view' && templateName.toLowerCase() !== 'view' && !this.viewConfiguration.get(templateName)) continue;

            if (stats.isFile) {
                let fileName = this.name;

                if (templateName === 'Controller' || templateName === 'ViewModel') fileName = this.name + templateName;

                const writePath = `${pathToInsert}/${fileName + templateExtension}`;
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
            xtype: this.name.charAt(0).toLowerCase() + this.name.slice(1),
            name: this.name,
            module: this.getTemplateModule(),
            location: Generator.createTemplateLocationString(this.location),
            userCls: ''
        };

        if (this.type === 'View') {
            data.controller = this.viewConfiguration.get('Controller');
            data.viewModel = this.viewConfiguration.get('ViewModel');

            if (this.viewConfiguration.get('Styles')) {
                // Create the `user-class-wih-component-name`
                data.userCls = this.name.split(/(?=[A-Z])/g).map(string => string.toLowerCase()).join('-');
            }
        }

        if (this.type === 'Store') {
            if (this.name.endsWith('s')) {
                // Remove the ending `s` to construct the Model name
                data.modelName = this.name.slice(0, this.name.length - 1);
            } else {
                throw new Error('Store name must be plural! Example: Products');
            }
        }

        return data;
    }

    private getTemplateModule(): string {
        return this.location.split('/')[3];
    }

    private getTemplatesPath(): string {
        const dirname = path.dirname(path.fromFileUrl(import.meta.url));
        return path.join(dirname, "templates", this.type.toLowerCase());
    }
}
