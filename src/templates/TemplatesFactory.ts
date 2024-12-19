export class TemplatesFactory {
  constructor(private pathName: string) {
    console.log(`TemplatesFactory: ${pathName}`);
  }

  async getComponentOptions() {
    const choices: string[] = [];

    try {
      for await (const dirEntry of Deno.readDir(this.pathName)) {
        choices.push(this.capitalize(dirEntry.name));
      }
    } catch (_) {
      throw Error(`Could not find template directory`);
    }

    return choices;
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
