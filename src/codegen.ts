import { ASTNode, BlockNode, DeclarationNode, FloatNode, IdentifierNode, IntNode } from "./ast";
import type { CodegenContext } from "./defs";


const indent = (g: CodegenContext) => "    ".repeat(g.currentDepth + 1);

const genInt = (g:CodegenContext, node: IntNode): string => {
    g.usesInt = true
    return node.value
}

const genFloat = (g:CodegenContext, node: FloatNode): string => node.value
const genIdentifier  = (g:CodegenContext, node: IdentifierNode): string => node.value

const genPrimary = (g: CodegenContext, node: ASTNode): string => {
    if (node instanceof IntNode) {
        return genInt(g, node);
    } else if (node instanceof FloatNode) {
        return genFloat(g, node);
    } else if (node instanceof IdentifierNode) {
        return genIdentifier(g, node);
    } else {
        throw new Error(`Unhandled Primary Node in Codegen: ${node.constructor.name}`);
    }
};

const genExpression = (g:CodegenContext, node: ASTNode): string => {
    return genPrimary(g, node);
}

const genDeclaration = (g:CodegenContext, node: DeclarationNode): string => {
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

const genStatement = (g:CodegenContext, node: ASTNode): string => {
    if (node instanceof DeclarationNode) {
        return genDeclaration(g, node);
    } else {
        throw new Error(`Unhandled Statement Node: ${node.constructor.name}`);
    }
}

const genBlock = (g:CodegenContext, node: BlockNode): string => {
    let code = "";
    for (let statement of node.statements) {
        code += indent(g) + genStatement(g, statement) + ";\n";
    }
    return code;
}

const genRoot = (g:CodegenContext): string => {
    return genBlock(g, g.program.block);
}

export const genCode = (g: CodegenContext) => {

    // Add main function
    let mainFuncStart = "\nint main () {\n"
    let mainFuncClosure = "\n}"

    // Add Headers afterwards, based on what all was used
    let headers  = "#include <stdlib.h>\n"
    headers += g.usesInt ? "#include <stdint.h>\n" : ""
    let footer = `\n    return ${ g.exitCode };` 
    g.cFileCode = headers + mainFuncStart + genRoot(g) + footer + mainFuncClosure;
    
};