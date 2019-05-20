# plat-schematics
Schematics to add platform structure and aliases to mono repo projects

Steps to install, after cloning the repo (with npm)

1. Move to the plat-structure folder and install the package `cd plat-structure && npm install`

2. Build the package with `npm run build`

3. Link this project to your node version, so you don't have to install it as part of the project it will be executed on, running 
`npm link`

You're set! Now you can exectute it from an Angular project, by running

`ng generate plat-structure:plat-structure --name=[name-of-your-project] --path=projects/[path-to-your-project]/src/app --dry-run=false`
WARNING: only use the --dry-run=false flag when actually want to write in your file system!