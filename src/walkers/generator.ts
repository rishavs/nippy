import { Visitor, ASTNode, RootNode, BlockNode, DeclarationNode, IdentifierNode, IntNode, FloatNode } from "../ast";

export class CodeGenerator extends Visitor {
    code: string = "";

    usesString  : boolean = false;
    usesInt     : boolean = false;
    usesFloat   : boolean = false;


    // Helper function to generate indent based on depth
    indent(node: ASTNode) {
        return "  ".repeat(node.scopeDepth);
    }

    // Override the visit method to apply indentation and recursion
    visit(node: ASTNode) {
        
        
    }
}
