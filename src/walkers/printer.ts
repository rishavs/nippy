import { Visitor, ASTNode, RootNode, BlockNode, DeclarationNode, IdentifierNode, IntNode, FloatNode } from "../ast";

export class ASTPrinter extends Visitor {
    nodesVisited = 0;
    msg: string = "";

    // Helper function to generate indent based on depth
    indent(node: ASTNode) {
        return "  ".repeat(node.depth);
    }

    // Override the visit method to apply indentation and recursion
    visit(node: ASTNode) {
        this.nodesVisited++;
        // Print the current node with proper indentation
        // if (node instanceof RootNode) {
        //     console.log(`${this.indent(node)}RootNode (at: ${node.at}, line: ${node.line})`);
        // } else if (node instanceof BlockNode) {
        //     console.log(`${this.indent(node)}BlockNode (at: ${node.at}, line: ${node.line}, symbols: ${JSON.stringify(node.symbols)})`);
        // } else if (node instanceof DeclarationNode) {
        //     console.log(`${this.indent(node)}DeclarationNode (at: ${node.at}, line: ${node.line}, mutable: ${node.isMutable}, new: ${node.isNewDeclaration})`);
        // } else if (node instanceof IdentifierNode) {
        //     console.log(`${this.indent(node)}IdentifierNode: ${node.value} (at: ${node.at}, line: ${node.line}`);
        // } else if (node instanceof IntNode) {
        //     console.log(`${this.indent(node)}IntNode: ${node.value} (at: ${node.at}, line: ${node.line}`);
        // } else if (node instanceof FloatNode) {
        //     console.log(`${this.indent(node)}FloatNode: ${node.value} (at: ${node.at}, line: ${node.line}`);
        // } else {
        //     console.log(`${this.indent(node)}Unknown node type (at: ${node.at}, line: ${node.line})`);
        // }
        let keyValPairs = Object.entries(node).map(([key, val]) => {
            if (["at", "line", "isMutable", "isNewDeclaration", "depth", "scopeDepth"].includes(key)) {
                return `${key}: ${val}`;
            }
            if (["parent", "scopeOwner"].includes(key)) {
                return key + ": " + (val && val.constructor.name ? val.constructor.name : "null");
            }
            if (key == "symbols") {
                return "symbols: " + JSON.stringify(val);
            }

        }).filter(Boolean);

        console.log(`${this.indent(node)}${node.constructor.name} ${(node as any).value ? (node as any).value : ""} ${keyValPairs.join(", ")}`);

    }

    leave (node: ASTNode) {}
}
