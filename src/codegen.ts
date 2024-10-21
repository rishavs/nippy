import { BlockNode, DeclarationNode, ExpressionNode, FloatNode, IdentifierNode, IntNode, RootNode, StatementNode, walk } from "./ast";
import type { CodegenContext } from "./defs";


const indent = (g: CodegenContext) => "    ".repeat(g.currentDepth + 1);

// Generate c99 code using the ast walker
export const genCode = (g: CodegenContext) => {
    let code = "#include <stdlib.h>\n"

    // Add Headers
    code += g.usesInt ? "#include <stdint.h>\n" : ""

    // Add main function
    code += "\nint main () {\n"
    code += genRoot(g)
    code += "}\n"

    g.cFileCode = code
    
};
export const genInt         = (g:CodegenContext, node: IntNode): string => node.value
export const genFloat       = (g:CodegenContext, node: FloatNode): string => node.value
export const genIdentifier  = (g:CodegenContext, node: IdentifierNode): string => node.value
export const genPrimary     = (g:CodegenContext, node: ExpressionNode): string => {
    switch (node.kind) {
        case "INT":
            return genInt(g, node as IntNode);
        case "FLOAT":
            return genFloat(g, node as FloatNode);
        case "IDENTIFIER":
            return genIdentifier(g, node as IdentifierNode);
        default:
            throw new Error(`Unhandled Primary Node in Codegen: ${node.kind}`);
    }
}
export const genExpression  = (g:CodegenContext, node: ExpressionNode): string => {
    return genPrimary(g, node);
}

export const genDeclaration = (g:CodegenContext, node: DeclarationNode): string => {
    let code = "";
    code += node.isNewDeclaration ? "int " : ""
    code += node.isMutable ? "" : ""
    code += node.identifier.value;
    if (node.assignment) {
        code += " = ";
        code += genExpression(g, node.assignment);
    }
    return code;
}

export const genStatement   = (g:CodegenContext, node: StatementNode): string => {
    switch (node.kind) {
        case "DECLARATION":
            return indent(g) + genDeclaration(g, node as DeclarationNode);
        default:
            throw new Error(`Unhandled Statement Node: ${node.kind}`);
    }
}

export const genBlock       = (g:CodegenContext, node: BlockNode): string => {
    let code = "";
    for (let statement of node.statements) {
        code += genStatement(g, statement) + ";\n";
    }
    return code;
}
export const genRoot        = (g:CodegenContext): string => {
    return genBlock(g, g.program.block);
}

