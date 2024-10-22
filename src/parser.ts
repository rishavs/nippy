import { BlockNode, DeclarationNode, ExpressionNode, FloatNode, IdentifierNode, IntNode, RootNode, StatementNode } from "./ast";
import type { ParsingContext } from "./defs"
import { MissingSpecificTokenError, MissingSyntaxError, TranspilingError, UnhandledError } from "./errors";

export const parseFile = (p: ParsingContext) => {

    let bl = block(p);
    if (bl instanceof BlockNode) {
        p.program.block = bl;
    } else {
        p.errors = bl;
    }
}

export const block = (p: ParsingContext): BlockNode | TranspilingError[] => {
    let token = p.tokens[p.i];
    let stmts: StatementNode[] = [];
    let errors: TranspilingError[] = [];

    while (p.i < p.tokens.length) {
        token = p.tokens[p.i];

        let stmt = statement(p); 
        if (stmt instanceof StatementNode) {
            stmts.push(stmt);
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
        return new BlockNode(stmts[0].at, stmts[0].line, stmts);
    }
    return errors;
}


export const recover = (p: ParsingContext) => {
    while (p.i < p.tokens.length && p.tokens[p.i].kind !== 'end') {
        p.i++;
    }
}


export const statement = (p: ParsingContext): StatementNode | TranspilingError  => {
    if (p.tokens[p.i].kind == 'let') {
        return declaration(p); // propagate result/error

    } else if (p.tokens[p.i].kind == 'ID') {
        if  (p.tokens[p.i] && p.tokens[p.i + 1].kind === '=') {
            return declaration(p); // propagate result/error
        // } else if (p.tokens[p.i] && p.tokens[p.i + 1].kind === '(') {
            // function call
            // return functionCall(p); // propagate result/error

        }
    }
    return new MissingSyntaxError('Statement', p.filepath, p.tokens[p.i].start, p.tokens[p.i].line, p.tokens[p.i].value);
}

export const declaration = (p: ParsingContext): DeclarationNode | TranspilingError => {
    let isNewDeclaration = false;
    let isMutable = false;

    let nodeStart = p.tokens[p.i].start;
    let token = p.tokens[p.i];

    if (token.kind === 'let') {
        p.i++;    // consume 'let'
        isNewDeclaration = true;
        if (! p.tokens[p.i] ) {
            return new MissingSyntaxError('Identifier', p.filepath, token.start, token.line);
        }
        token = p.tokens[p.i];

        if (token && token.kind === 'var') {
            p.i++;    // consume 'var'
            isMutable = true;
        }
    }

    if (! p.tokens[p.i] ) {
        return new MissingSyntaxError('Identifier', p.filepath, token.start, token.line);
    }
    token = p.tokens[p.i];

    let id = identifier(p); // propagate result/error
    if (id instanceof TranspilingError) {
        return id;
    }
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

    let assignment = expression(p); // propagate result/error
    if (assignment instanceof TranspilingError) {
        return assignment;
    }
    
    return new DeclarationNode(nodeStart, assignment.line, isMutable, isNewDeclaration, id, assignment);

}

export const expression = (p: ParsingContext): ExpressionNode | TranspilingError => {
    return primary(p);
}

const primary = (p: ParsingContext): ExpressionNode | TranspilingError => {

    switch (p.tokens[p.i].kind) {
        case 'INT':
            return int(p); // propagate result/error

        case 'FLOAT':
            return float(p); // propagate result/error

        // TODO - separate identifier from function call
        case 'ID':
            return identifier(p); // propagate result/error

        default:
            return new MissingSyntaxError('Expression', p.filepath, p.tokens[p.i].start, p.tokens[p.i].line, p.tokens[p.i].value);
    }
}

const int = (p: ParsingContext): IntNode => {
    let token = p.tokens[p.i];
    p.i++; // consume the number
    return new IntNode(token.start, token.line, token.value);
}

const float = (p: ParsingContext): FloatNode => {
    let token = p.tokens[p.i];
    p.i++; // consume the number
    return new FloatNode(token.start, token.line, token.value);
}

export const identifier = (p: ParsingContext): IdentifierNode | TranspilingError => {
    let token = p.tokens[p.i];
    p.i++; // consume the number
    return new IdentifierNode(token.start, token.line, token.value);
}
