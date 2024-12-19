import input from "@inquirer/input";
import select from "@inquirer/select";
import confirm from "@inquirer/confirm";
import { TemplatesFactory } from '../templates/TemplatesFactory.ts'
import { ComponentValidator } from './ComponentValidator.ts'

export class Component {
  #type = "";
  #name = "";
  #location = ""
  #controller = false;
  #viewModel = false;
  #styles = false;

  constructor(
      private templatesFactory: TemplatesFactory,
      private componentValidator: ComponentValidator,
      ) {}

  get type() {
    return this.#type;
  }

  set type(value: string) {
    this.#type = value;
  }

  get name() {
    return this.#name;
  }

  set name(value: string) {
    this.#name = value;
  }

  get controller() {
    return this.#controller
  }

  set controller(value: boolean) {
    this.#controller = value
  }

  get viewModel() {
    return this.#viewModel
  }

  set viewModel(value: boolean) {
    this.#viewModel = value
  }

  get styles() {
    return this.#styles
  }

  set styles(value: boolean) {
    this.#styles = value
  }

  get location() {
    return this.#location;
  }

  set location(value: string) {
    this.#location = `/app/${this.type.toLowerCase()}/${value}`;
  }

  async pickType() {
    const choices = await this.templatesFactory
      .getComponentOptions()
      .catch((error) => {
        console.error(error.message);
        Deno.exit(1);
      });

    this.type = await select({
      message: "What type of component would you like to generate?",
      choices: choices,
    });
  }

  async askName() {
    this.name = await input({
      message: "Component name:",
      required: true,
      validate: (answer) => this.componentValidator.validateName(answer),
    });
  }

  async askLocation() {
    this.location = await input({
      message: "Component location (path):",
      required: true,
      validate: (answer) => this.componentValidator.validateLocation(answer),
      transformer: (answer: string) => this.transformLocationValue(answer),
    });
  }

  async confirmController() {
    this.controller = await confirm({
      message: "Add a Controller file?",
      default: true,
    });
  }

  async confirmViewModel() {
    this.viewModel = await confirm({
      message: "Add a ViewModel file?",
      default: true,
    });
  }

  async confirmStyles() {
    this.styles = await confirm({
      message: "Add a styles file?",
      default: true,
    });
  }

  private transformLocationValue(input: string) {
    const prefix = `/app/${this.type.toLowerCase()}/`;
    const isLastInput = input.startsWith(prefix);

    return isLastInput ? input : prefix + input;
  }
}
