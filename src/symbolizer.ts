import { BlockNode, DeclarationNode, type BaseNode } from "./ast";

export const buildSymbols = (node: BaseNode) => {
    if (node instanceof BlockNode) {
        for (let statement of node.statements) {
            if (statement instanceof DeclarationNode) {
                // check if the identifier is already declared
                if (statement.isNewDeclaration && node.symbols.hasOwnProperty(statement.identifier.value)) {
                    throw new Error(`Identifier ${statement.identifier.value} is already declared in this scope`);
                } else if (!statement.isNewDeclaration && statement.assignment && !node.symbols.hasOwnProperty(statement.identifier.value)) {
                    // check if the identifier is already declared
                    throw new Error(`Identifier ${statement.identifier.value} is not declared in this scope`);
                }

                node.symbols[statement.identifier.value] = statement.isNewDeclaration ? "int" : "float";
            } else {
                throw new Error(`Unhandled Statement Node: ${statement.constructor.name}`);
            }
        }
    }
}

// Add parentScope to block node

// rebuild symbols and add the parent block's symbols to current block's symbols