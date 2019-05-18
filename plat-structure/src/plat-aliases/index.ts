import { dasherize } from '@angular-devkit/core/src/utils/strings';
import { 
  Rule,
  SchematicContext,
  Tree, 
  chain,
  schematic
} from '@angular-devkit/schematics';

// we write this to create aliases for our projects apps that we can use to import 
// symbols
export function platAliases(_options: any): Rule {
  return chain([
    // chains and generates the generate-files schematic
    // we want to pass it as a schematic and its options, so we can validate them!
    schematic(`plat-structure`, _options),
    (tree: Tree, _context: SchematicContext) => {
      _context.logger.info(JSON.stringify(_options) + ' options to generate the project aliases');
      // create an alias constant that is equal to the dasherized name we pass as options
      // we need to use this to get the path to the right app in projects

      const alias = dasherize(_options.name);
      const dir = `/projects/${alias}/`;

      _context.logger.info(dir + ' directory path in question');
      // make some verifications before moving on
      // should get dir for app
      tree.getDir(dir).visit(filePath => {
        // make sure we're inside of an app
        if (!filePath.endsWith('tsconfig.app.json')) {
          return;
        }
  
        const tsConfigBuffer = tree.read(filePath);
        if (!tsConfigBuffer) {
          _context.logger.info('Sorry! No file path');
          return;
        }
        
        // cash the tsconfig file contents in order to update them with our aliases
        const rawTsConfig = JSON.parse(tsConfigBuffer.toString('utf-8'));
        // cash both the paths property as object
        const paths = { ...rawTsConfig['compilerOptions']['paths'] };

        paths[`@${alias}/*`] = [`/src/*`, `/src/app/*`];
        
        // actually modify the file
        const decoratedAppTsConfigJSON = {
          ...rawTsConfig,
          compilerOptions: {
            ...rawTsConfig['compilerOptions'],
            paths
          }
        };
        
        // overwrite the tsconfigfile!
        tree.overwrite(filePath, JSON.stringify(decoratedAppTsConfigJSON, null, 2));
      });
  
      return tree;
    },
  ]);
}