// ---------------------------
// Special nodes
// ---------------------------
export class BaseNode {
    at: number;
    line: number;
    parent: BaseNode | null = null;
    constructor(at: number, line: number) {
        this.at = at;
        this.line = line;
    }
}

export class StatementNode extends BaseNode {
    constructor(at: number, line: number) {
        super(at, line);
    }
}

export class ExpressionNode extends BaseNode {
    constructor(at: number, line: number) {
        super(at, line);
    }
}

// ---------------------------
// Statements
// ---------------------------
export class RootNode extends BaseNode {
    block: BlockNode;
    constructor(at: number, line: number, block: BlockNode) {
        super(at, line);
        this.block = block;
    }
}

export class BlockNode extends BaseNode {
    statements: StatementNode[];
    constructor(at: number, line: number, statements: StatementNode[]) {
        super(at, line);
        this.statements = statements;
    }
}

export class DeclarationNode extends StatementNode {
    isMutable: boolean;
    isNewDeclaration: boolean;
    identifier: IdentifierNode;
    assignment: ExpressionNode | null;
    symbols: Record<string, string> = {}; // name => type
    constructor(at: number, line: number, 
        isMutable: boolean, isNewDeclaration: boolean, identifier: IdentifierNode, assignment?: ExpressionNode,
    ) {
        super(at, line);
        this.isMutable = isMutable;
        this.isNewDeclaration = isNewDeclaration;
        this.identifier = identifier;
        this.assignment = assignment || null;
    }
}

// ---------------------------
// Expressions
// ---------------------------
export class IdentifierNode extends ExpressionNode {
    value: string;
    constructor(at: number, line: number, value: string) {
        super(at, line);
        this.value = value;
    }
}

export class IntNode extends ExpressionNode {
    value: string;
    constructor(at: number, line: number, value: string) {
        super(at, line);
        this.value = value;
    }
}

export class FloatNode extends ExpressionNode {
    value: string;
    constructor(at: number, line: number, value: string) {
        super(at, line);
        this.value = value;
    }
}

// ---------------------------
// Walker
// ---------------------------
export const walk = (node: BaseNode, depth:number, fn: Function) => {
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