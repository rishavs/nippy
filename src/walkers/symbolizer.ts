import { Visitor, ASTNode, DeclarationNode, Checker } from "../ast";
import { SymbolInfo } from "../defs";
import { MissingSymbolInitializationError, SymbolRedeclarationError, type TranspilingError } from "../errors";

export class Symbolizer extends Checker {

    // [] variable has already been declared and cannot be redeclared
    // [] variable has not been declred and cannot be assigned
    // [] variable is defined as const and cannot be reassigned
   
    visit(node: ASTNode, filepath: string,  errors: TranspilingError[]) {
        if (node instanceof DeclarationNode) {
            if (node.isNewDeclaration) {
                if (node.scopeOwner!.symbols.hasOwnProperty(node.identifier.value)) {
                    let error = new SymbolRedeclarationError(node.identifier.value, filepath, node.at, node.line);
                    errors.push(error);
                } else {
                    // Add symbol to table
                    node.scopeOwner!.symbols[node.identifier.value] = new SymbolInfo(node.identifier.value, node.isMutable, node);
                }
            }
            if (node.assignment) {
                if (!node.scopeOwner!.symbols.hasOwnProperty(node.identifier.value)) {
                    let error = new MissingSymbolInitializationError(node.identifier.value, filepath, node.at, node.line);
                    errors.push(error);
                }
            }
        }
    }

    leave (node: ASTNode, filepath:string, errors: TranspilingError[]) {}

}
