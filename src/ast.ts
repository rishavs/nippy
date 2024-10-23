// ---------------------------
// Abstract nodes

import type { Block } from "typescript";

// ---------------------------
export abstract class ASTNode {
    at: number;
    line: number;

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
    }
}

export class BlockNode extends ASTNode {
    statements  : ASTNode[] = []
    symbols     : Record<string, string> = {}; // name => type
    constructor(at: number, line: number) {
        super(at, line);
    }

    accept(v: Visitor) {
        v.visit(this);
        this.statements.forEach((stmt) => stmt.accept(v));
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
    }
}

// ---------------------------
// Expressions
// ---------------------------
export class IdentifierNode extends ASTNode {
    value: string;
    constructor(at: number, line: number, value: string) {
        super(at, line);
        this.value = value;
    }

    accept(v: Visitor) {
        v.visit(this);
    }
}

export class IntNode extends ASTNode {
    value: string;
    constructor(at: number, line: number, value: string) {
        super(at, line);
        this.value = value;
    }

    accept(v: Visitor) {
        v.visit(this);
    }
}

export class FloatNode extends ASTNode {
    value: string;
    constructor(at: number, line: number, value: string) {
        super(at, line);
        this.value = value;
    }

    accept(v: Visitor) {
        v.visit(this);
    }
}

// ---------------------------
// Walker
// ---------------------------
export const walk = (node: ASTNode, depth:number, fn: Function) => {
    fn(node, depth);
    if (node instanceof RootNode) {
        walk(node.block, depth + 1, fn);
    } else if (node instanceof BlockNode) {
        node.statements.forEach((stmt) => walk(stmt, depth + 1, fn));
    } else if (node instanceof DeclarationNode) {
        walk(node.identifier, depth + 1, fn);
        if (node.assignment) {
            walk(node.assignment, depth + 1, fn);
        }
    } 
}

export abstract class Visitor {
    visit(node: ASTNode) {}
}