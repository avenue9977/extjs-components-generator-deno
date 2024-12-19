import { COMPONENT_TYPE } from '../component/Component.ts'

export class TemplatesFactory {
  constructor(public pathName: string) {}

  async getComponentOptions() {
    const choices: COMPONENT_TYPE[] = [];

    try {
      for await (const dirEntry of Deno.readDir(this.pathName)) {
        choices.push(dirEntry.name as COMPONENT_TYPE);
      }
    } catch (_) {
      throw Error(`Could not find template directory`);
    }

    return choices;
  }
}
