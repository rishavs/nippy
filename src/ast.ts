// ---------------------------
// Abstract nodes

import type { Block } from "typescript";
import type { TranspilingError } from "./errors";
import type { SymbolInfo } from "./defs";

// ---------------------------
export abstract class ASTNode {
    at: number;
    line: number;

    type: string = "";                          // type of the node

    parent: ASTNode | null = null;              // immediate parent
    depth: number = 0;                          // distance from root
    scopeDepth: number = 0;                     // distance from root in terms of scope
    scopeOwner: BlockNode | null = null;        // the block that owns the scope of this node

    constructor(at: number, line: number) {
        this.at = at;
        this.line = line;
    }

    accept(v: Visitor) {}
}

// ---------------------------
// Statements
// ---------------------------
export class RootNode extends ASTNode {
    block!: BlockNode;
    constructor(at: number, line: number) {
        super(at, line);
    }

    accept(v: Visitor) {
        v.visit(this);
        this.block.accept(v);
        v.leave(this);
    }
}

export class BlockNode extends ASTNode {
    statements  : ASTNode[] = []
    symbols     : Record<string, SymbolInfo> = {}; // name => type
    constructor(at: number, line: number) {
        super(at, line);
    }

    accept(v: Visitor) {
        v.visit(this);
        this.statements.forEach((stmt) => stmt.accept(v));
        v.leave(this);
    }
}

export class DeclarationNode extends ASTNode {
    isMutable!: boolean;
    isNewDeclaration!: boolean;
    identifier!: IdentifierNode;
    assignment!: ASTNode | null;
    constructor(at: number, line: number) {
        super(at, line);
    }

    accept(v: Visitor) {
        v.visit(this);
        this.identifier.accept(v);
        if (this.assignment) {
            this.assignment.accept(v);  
        }
        v.leave(this);
    }
}

// ---------------------------
// Expressions
// ---------------------------
export class IdentifierNode extends ASTNode {
    value: string;
    type: string = "";
    constructor(at: number, line: number, value: string) {
        super(at, line);
        this.value = value;
    }
}

export class IntNode extends ASTNode {
    value: string;
    type: string = "Int";
    constructor(at: number, line: number, value: string) {
        super(at, line);
        this.value = value;
    }
}

export class FloatNode extends ASTNode {
    value: string;
    type: string = "Dec";
    constructor(at: number, line: number, value: string) {
        super(at, line);
        this.value = value;
    }
}

// ---------------------------
// Visitor
// ---------------------------
export abstract class Visitor {
    visit(node: ASTNode) {}
    leave(node: ASTNode) {}
}

export abstract class Checker {
    visit(node: ASTNode, filepath: string, errors: TranspilingError[]) {}
    leave(node: ASTNode, filepath: string, errors: TranspilingError[]) {}
}
// ---------------------------
// Walker
// ---------------------------

export const walk = (node: ASTNode, filepath: string, errors: TranspilingError[], c: Checker) => {
    c.visit(node, filepath, errors);

    // walk down the tree
    if (node instanceof RootNode) {
        walk(node.block, filepath, errors, c);
    } else if (node instanceof BlockNode) {
        node.statements.forEach((stmt) => walk(stmt, filepath, errors, c));
    } else if (node instanceof DeclarationNode) {
        walk(node.identifier, filepath, errors, c);
        if (node.assignment) {
            walk(node.assignment, filepath, errors, c);;
        }
    } 
    c.leave(node, filepath, errors);
}