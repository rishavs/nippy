import { Visitor, ASTNode, DeclarationNode } from "../ast";

export class Symbolizer extends Visitor {

    // [] variable has already been declared and cannot be redeclared
    // [] variable has not been declred and cannot be assigned
    // [] variable is defined as const and cannot be reassigned
    
    visit(node: ASTNode) {
        if (node instanceof DeclarationNode) {
            if (node.isNewDeclaration) {
                if (node.scopeOwner!.symbols.hasOwnProperty(node.identifier.value)) {
                    throw new Error(`Symbol already defined in scope: ${node.identifier.value}`);
                } else {
                    node.scopeOwner!.symbols[node.identifier.value] = "MINTY";
                }
            }
            if (node.assignment) {
                if (!node.scopeOwner!.symbols.hasOwnProperty(node.identifier.value)) {
                    throw new Error(`Symbol was not declared in scope and cannot be assigned to: ${node.identifier.value}`);
                }
            }
        }
    }

    leave (node: ASTNode) {}

}
