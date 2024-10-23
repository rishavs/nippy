import { Visitor, ASTNode, RootNode, BlockNode, DeclarationNode, IdentifierNode, IntNode, FloatNode } from "../ast";

export class ASTPrinter extends Visitor {
    depth: number = 0;

    // Helper function to generate indent based on depth
    indent() {
        return "  ".repeat(this.depth);
    }

    // Override the visit method to apply indentation and recursion
    visit(node: ASTNode) {
        // Increase the depth before visiting child nodes
        this.depth++;

        // Print the current node with proper indentation
        if (node instanceof RootNode) {
            console.log(`${this.indent()}RootNode (at: ${node.at}, line: ${node.line})`);
        } else if (node instanceof BlockNode) {
            console.log(`${this.indent()}BlockNode (at: ${node.at}, line: ${node.line}, symbols: ${JSON.stringify(node.symbols)})`);
        } else if (node instanceof DeclarationNode) {
            console.log(`${this.indent()}DeclarationNode (at: ${node.at}, line: ${node.line}, mutable: ${node.isMutable}, new: ${node.isNewDeclaration})`);
        } else if (node instanceof IdentifierNode) {
            console.log(`${this.indent()}IdentifierNode (at: ${node.at}, line: ${node.line}, value: ${node.value})`);
        } else if (node instanceof IntNode) {
            console.log(`${this.indent()}IntNode (at: ${node.at}, line: ${node.line}, value: ${node.value})`);
        } else if (node instanceof FloatNode) {
            console.log(`${this.indent()}FloatNode (at: ${node.at}, line: ${node.line}, value: ${node.value})`);
        } else {
            console.log(`${this.indent()}Unknown node type (at: ${node.at}, line: ${node.line})`);
        }

        // Decrease the depth after visiting child nodes
        this.depth--;
    }
}
