import { Rule,
  SchematicContext,
  Tree,
  apply,
  move,
  url,
  template,
  chain,
  branchAndMerge,
  mergeWith
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function platStructure(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    // put a logger here to see our options
    _context.logger.info(JSON.stringify(_options) + ' params to generate our structure');

    const source = apply(url('./files'), [
      // use template to actually create files in the system, as described by our options passed
      template({
        ...strings,
        ..._options as object,
      } as any),
      move(_options.path)
    ]);

    //return tree;
    return chain([branchAndMerge(chain([mergeWith(source)]))])(tree, _context);
  };
}
