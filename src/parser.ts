import { ASTNode, BlockNode, DeclarationNode, FloatNode, IdentifierNode, IntNode } from "./ast";
import type { ParsingContext } from "./defs"
import { MissingSpecificTokenError, MissingSyntaxError, TranspilingError, UnhandledError } from "./errors";

export const parseFile = (p: ParsingContext) => {

    let bl = block(p, p.program);
    if (bl instanceof BlockNode) {
        p.program.block = bl;

        bl.parent = p.program;
        bl.depth = p.program.depth + 1;
        bl.scopeOwner = null;
        bl.scopeDepth = 0;
    } else {
        p.errors = bl;
    }
}

export const block = (p: ParsingContext, parent: ASTNode): BlockNode | TranspilingError[] => {

    let token = p.tokens[p.i];
    let errors: TranspilingError[] = [];

    let block = new BlockNode(token.start, token.line);
    block.parent = parent;
    block.depth = parent.depth + 1;
    block.scopeDepth = parent.scopeDepth
    block.scopeOwner = parent.scopeOwner;

    while (p.i < p.tokens.length) {
        token = p.tokens[p.i];

        let stmt = statement(p, block); 
        if (stmt instanceof ASTNode) {
             block.statements.push(stmt);
        // propagate result/error
        } else if (stmt instanceof TranspilingError) {
            errors.push(stmt);
            recover(p);
        } else {
            errors.push(new UnhandledError(p.filepath , token.start, token.line));
            recover(p);
        }
    }
    if (errors.length === 0) {
        return block
    }
    return errors;
}


export const recover = (p: ParsingContext) => {
    while (p.i < p.tokens.length && p.tokens[p.i].kind !== 'end') {
        p.i++;
    }
}


export const statement = (p: ParsingContext, parent: ASTNode): ASTNode | TranspilingError  => {
    if (p.tokens[p.i].kind == 'let') {
        return declaration(p, parent); // propagate result/error

    } else if (p.tokens[p.i].kind == 'ID') {
        if  (p.tokens[p.i] && p.tokens[p.i + 1].kind === '=') {
            return declaration(p, parent); // propagate result/error
        // } else if (p.tokens[p.i] && p.tokens[p.i + 1].kind === '(') {
            // function call
            // return functionCall(p); // propagate result/error

        }
    }
    return new MissingSyntaxError('Statement', p.filepath, p.tokens[p.i].start, p.tokens[p.i].line, p.tokens[p.i].value);
}

export const declaration = (p: ParsingContext, parent:ASTNode): DeclarationNode | TranspilingError => {
    let token = p.tokens[p.i];

    let node = new DeclarationNode(token.start, token.line);
    node.isMutable = false;
    node.isNewDeclaration = false;

    node.parent = parent;
    node.depth = parent.depth + 1;
    node.scopeOwner = parent.scopeOwner;
    node.scopeDepth = parent.scopeDepth;


    if (token.kind === 'let') {
        p.i++;    // consume 'let'
        node.isNewDeclaration = true;
        if (! p.tokens[p.i] ) {
            return new MissingSyntaxError('Identifier', p.filepath, token.start, token.line);
        }
        token = p.tokens[p.i];

        if (token && token.kind === 'var') {
            p.i++;    // consume 'var'
            node.isMutable = true;
        }
    }

    if (! p.tokens[p.i] ) {
        return new MissingSyntaxError('Identifier', p.filepath, token.start, token.line);
    }
    token = p.tokens[p.i];

    let id = identifier(p, node); // propagate result/error
    if (id instanceof TranspilingError) {
        return id;
    }
    node.identifier = id;

    if (! p.tokens[p.i] ) {
        return new MissingSpecificTokenError('Variable Declaration', "'='", p.filepath, id.at, id.line);
    }
    token = p.tokens[p.i];

    if (p.tokens[p.i].kind !== '=') {
        return new MissingSpecificTokenError('Variable Declaration', "'='", p.filepath, id.at, id.line, p.tokens[p.i].value);
    }
    p.i++; // consume '='

    if (! p.tokens[p.i] ) {
        return new MissingSyntaxError('Expression', p.filepath, p.tokens[p.i - 1].start, p.tokens[p.i - 1].line);
    }

    let assignment = expression(p, node); // propagate result/error
    if (assignment instanceof TranspilingError) {
        return assignment;
    }

    node.assignment = assignment;
   
    return node
}

export const expression = (p: ParsingContext, parent: ASTNode): ASTNode | TranspilingError => {
    return primary(p, parent);
}

const primary = (p: ParsingContext, parent: ASTNode): ASTNode | TranspilingError => {

    switch (p.tokens[p.i].kind) {
        case 'INT':
            return int(p, parent); // propagate result/error

        case 'FLOAT':
            return float(p, parent); // propagate result/error

        // TODO - separate identifier from function call
        case 'ID':
            return identifier(p, parent); // propagate result/error

        default:
            return new MissingSyntaxError('Expression', p.filepath, p.tokens[p.i].start, p.tokens[p.i].line, p.tokens[p.i].value);
    }
}

const int = (p: ParsingContext, parent: ASTNode): IntNode => {
    let token = p.tokens[p.i];
    p.i++; // consume the number
    let node = new IntNode(token.start, token.line, token.value);
    node.parent = parent;
    node.depth = parent.depth + 1;
    node.scopeOwner = parent.scopeOwner;
    node.scopeDepth = parent.scopeDepth;

    return node;
}

const float = (p: ParsingContext, parent: ASTNode): FloatNode => {
    let token = p.tokens[p.i];
    p.i++; // consume the number
    let node = new FloatNode(token.start, token.line, token.value);
    node.parent = parent;
    node.depth = parent.depth + 1;
    node.scopeOwner = parent.scopeOwner;
    node.scopeDepth = parent.scopeDepth;

    return node;
}

export const identifier = (p: ParsingContext, parent: ASTNode): IdentifierNode | TranspilingError => {
    let token = p.tokens[p.i];
    p.i++; // consume the number
    let node = new IdentifierNode(token.start, token.line, token.value);
    node.parent = parent;
    node.depth = parent.depth + 1;
    node.scopeOwner = parent.scopeOwner;
    node.scopeDepth = parent.scopeDepth;

    return node;
}
