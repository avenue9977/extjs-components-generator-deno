# ExtJS Components Generator CLI

![Deno](https://img.shields.io/badge/Deno-2.0+-green.svg)
[![Testing](https://github.com/avenue9977/extjs-components-generator-deno/actions/workflows/deno.yml/badge.svg?branch=master)](https://github.com/avenue9977/extjs-components-generator-deno/actions/workflows/deno.yml)

A CLI tool built with Deno to generate ExtJS components based on user input.

## Features

- **Interactive Prompts:** Guides you through the component creation process step-by-step.
- **Efficient Workflow:** Automatically generates ExtJS views, controllers, models, and other relevant files.
- **Lightweight and Fast:** Built with Deno, ensuring a lightweight and secure environment.

## Prerequisites

- [Deno](https://deno.com/) installed on your system.

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/extjs-components-generator.git
   ```

2. Navigate to the project directory:
    ```bash
   cd extjs-components-generator-deno
   ```

3. Run the CLI directly with Deno:
   ```bash
   deno run --allow-env --allow-read --allow-write --allow-run ./src/main.ts
   ```
   
## Usage

### Interactive Mode
Run the CLI in interactive mode to generate a new ExtJS component:
   ```bash
      deno run --allow-env --allow-read --allow-write --allow-run ./src/main.ts
   ```
You’ll be prompted to provide details such as:
- Component type (view, controller, model)
- Component name
- Component location
- Additional component definitions

Command-Line Arguments

You can also pass arguments directly for a more automated process:

   ```bash
      deno run --allow-read --allow-write --allow-env ./src/main.ts --name MyApplicationName 
   ```
Available options:
- `--name`: Name of your application.

### File Structure

The generated files will follow this structure:
```
app/
├── view/
│     └── card/
│           └── Card.js
│           └── CardController.js
│           └── CardViewModel.js
│           └── styles.scss
```

### Configuration
You can customize the templates by modifying the files in the `src/resources/templates/` directory. These templates define the structure and content of the generated components.

### License
his project is licensed under the [MIT](https://choosealicense.com/licenses/mit/) License.

Built with ❤️ using Deno.
