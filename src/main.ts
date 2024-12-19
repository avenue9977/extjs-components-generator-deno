import confirm from "@inquirer/confirm";
import input from "@inquirer/input";
import select from "@inquirer/select";
import * as path from "jsr:@std/path";
import { Component } from './component/Component.ts'
import { ComponentValidator } from './component/ComponentValidator.ts'
import { Generator } from './generator/Generator.ts'
import { TemplatesFactory } from './templates/TemplatesFactory.ts'

type Answers = {
  component: string;
  name: string;
  location: string;
  controller: boolean;
  viewModel: boolean;
  styles: boolean;
};


if (import.meta.main) {
  const dirname = path.dirname(path.fromFileUrl(import.meta.url));
  const templatesDirectoryPath = path.join(dirname, "resources", "templates");

  const templatesFactory = new TemplatesFactory(templatesDirectoryPath);
  const componentValidator = new ComponentValidator();
  const component = new Component(templatesFactory, componentValidator);

  await component.pickType()
  await component.askName()
  await component.askLocation()

  const answers: Answers = {
    component: "",
    name: "",
    location: "",
    controller: false,
    viewModel: false,
    styles: false,
  };

  if (component.type === 'View') {
    await component.confirmController()
    await component.confirmViewModel()
    await component.confirmStyles()
  }

  const viewConfiguration = new Map([
    ["Controller", answers.controller],
    ["ViewModel", answers.viewModel],
    ["Styles", answers.styles],
  ]);

  const generator = new Generator(
      component,
    answers.component,
    answers.name,
    answers.location,
    viewConfiguration,
  );

  generator.createComponentFiles();

  console.log(answers);

  Deno.exit(0);
}
