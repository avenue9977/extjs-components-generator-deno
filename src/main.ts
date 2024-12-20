import { parseArgs } from "@std/cli";
import * as path from "jsr:@std/path";
import { Component, COMPONENT_TYPE } from "./component/Component.ts";
import { ComponentValidator } from "./component/ComponentValidator.ts";
import { Generator } from "./generator/Generator.ts";
import { TemplatesFactory } from "./templates/TemplatesFactory.ts";

if (import.meta.main) {
  const { name: appName } = parseArgs(Deno.args, {
    string: ["name", "n"],
    alias: {
      name: ["name", "n"],
    },
    default: {
      name: "app",
    },
  });
  const dirname = path.dirname(path.fromFileUrl(import.meta.url));
  const templatesDirectoryPath = path.join(dirname, "resources", "templates");

  const templatesFactory = new TemplatesFactory(templatesDirectoryPath);
  const componentValidator = new ComponentValidator();
  const component = new Component(
    appName,
    templatesFactory,
    componentValidator,
  );

  await component.selectType();
  await component.askName();
  await component.askLocation();

  if (component.type === COMPONENT_TYPE.VIEW) {
    await component.confirmController();
    await component.confirmViewModel();
    await component.confirmStyles();
  }

  const generator = new Generator(component);

  generator.createComponentFiles();

  console.log("Component created successfully.");

  Deno.exit(0);
}
