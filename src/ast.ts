// ---------------------------
// Special nodes
// ---------------------------
export class BaseNode {
    kind: string
    at: number;
    line: number;
    constructor(kind: string, at: number, line: number) {
        this.kind = kind;
        this.at = at;
        this.line = line;
    }
}

export class StatementNode extends BaseNode {
    constructor(kind: string, at: number, line: number) {
        super(kind, at, line);
    }
}

export class ExpressionNode extends BaseNode {
    constructor(kind: string, at: number, line: number) {
        super(kind, at, line);
    }
}

// ---------------------------
// Statements
// ---------------------------
export class RootNode extends BaseNode {
    block: BlockNode;
    constructor(at: number, line: number, block: BlockNode) {
        super('ROOT', at, line);
        this.block = block;
    }
}

export class BlockNode extends BaseNode {
    statements: StatementNode[];
    constructor(at: number, line: number, statements: StatementNode[]) {
        super('BLOCK', at, line);
        this.statements = statements;
    }
}

export class DeclarationNode extends StatementNode {
    isMutable?: boolean;
    isNewDeclaration: boolean;
    identifier: IdentifierNode;
    assignment: ExpressionNode | null;
    constructor(at: number, line: number, 
        isMutable: boolean, isNewDeclaration: boolean, identifier: IdentifierNode, assignment?: ExpressionNode,
    ) {
        super('DECLARATION', at, line);
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
        super('IDENTIFIER', at, line);
        this.value = value;
    }
}

export class IntNode extends ExpressionNode {
    value: string;
    constructor(at: number, line: number, value: string) {
        super('INT', at, line);
        this.value = value;
    }
}

export class FloatNode extends ExpressionNode {
    value: string;
    constructor(at: number, line: number, value: string) {
        super('FLOAT', at, line);
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
    } else if (node instanceof IdentifierNode) {
        // do nothing
    } else if (node instanceof IntNode) {
        // do nothing
    } else if (node instanceof FloatNode) {
        // do nothing
    }
}