import { Visitor, ASTNode, RootNode, BlockNode, DeclarationNode, IdentifierNode, IntNode, FloatNode } from "../ast";

export class CodeGenerator extends Visitor {
    code: string = "";
    headers: string = "";

    usesString  : boolean = false;
    usesInt     : boolean = false;
    usesFloat   : boolean = false;


    // Helper function to generate indent based on depth
    indent(node: ASTNode) {
        return "  ".repeat(node.scopeDepth);
    }

    buildHeaders() {}

    // Override the visit method to apply indentation and recursion
    visit(node: ASTNode) {
        if (node instanceof RootNode) {
            this.code += `int main() {\n`;
        } else if (node instanceof BlockNode) {
            this.code += `${this.indent(node)}{\n`;
        } else if (node instanceof DeclarationNode) {
            this.code += `${this.indent(node)}` 
            this.code += node.isNewDeclaration ? "int " : "" 
            this.code += `${node.identifier.value} = `;
        } else if (node instanceof IdentifierNode) {
            // if (node.parent instanceof DeclarationNode) {
            //     this.code += `${node.value}`;
            // }
        } else if (node instanceof IntNode) {
            if (node.parent instanceof DeclarationNode) {
                this.code += `${node.value}`;
            }
        } else if (node instanceof FloatNode) {
            if (node.parent instanceof DeclarationNode) {
                this.code += ` = ${node.value}`;
            }
        } else {
            throw new Error(`Unknown node type: ${node.constructor.name}`);
        }
    }

    leave (node: ASTNode) {
        if (node instanceof RootNode) {
            this.code += `}\n`;
        } else if (node instanceof BlockNode) {
            this.code += `${this.indent(node)}\n`;
        } else if (node instanceof DeclarationNode) {
            this.code += `;\n`;
        } 
    }

}
