import * as path from "jsr:@std/path";
import { Component } from './component/Component.ts'
import { ComponentValidator } from './component/ComponentValidator.ts'
import { Generator } from './generator/Generator.ts'
import { TemplatesFactory } from './templates/TemplatesFactory.ts'


if (import.meta.main) {
  const dirname = path.dirname(path.fromFileUrl(import.meta.url));
  const templatesDirectoryPath = path.join(dirname, "resources", "templates");

  const templatesFactory = new TemplatesFactory(templatesDirectoryPath);
  const componentValidator = new ComponentValidator();
  const component = new Component(templatesFactory, componentValidator);

  await component.pickType()
  await component.askName()
  await component.askLocation()

  if (component.type === 'View') {
    await component.confirmController()
    await component.confirmViewModel()
    await component.confirmStyles()
  }

  const viewConfiguration = new Map([
    ["Controller", component.controller],
    ["ViewModel", component.viewModel],
    ["Styles", component.styles],
  ]);

  const generator = new Generator(
      component,
    component.type,
    component.name,
    component.location,
    viewConfiguration,
  );

  generator.createComponentFiles();

  Deno.exit(0);
}
