import { Token, type LexingContext } from "./defs";
import { IllegalTokenError, UnclosedDelimiterError } from "./errors";


const isAlphabet = (c: string): boolean =>  
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(c);

const isDigit = (c: string): boolean => 
    '0123456789'.includes(c);

const ws = (l: LexingContext) => {
    while (l.i < l.src.length && ' \t\r\n'.includes(l.src[l.i])) {
        if (l.src[l.i] === '\n') {
            l.line++;
        }
        l.i++;
    }
}

const number = (l: LexingContext): Token => {
    let token = new Token('INT', '', l.i, l.i, l.line);
    token.end = l.i;
    let isFloat = false;
    while (
        token.end < l.src.length && 
        (isDigit(l.src[token.end]) || l.src[token.end] === '.' || l.src[token.end] === '_' )
    ) {
        if (l.src[token.end] === '_') {
            token.end++;
            continue;
        }
        if (l.src[token.end] === '.') {
            if (isFloat) {
                break;
            }
            isFloat = true;
            token.kind = 'FLOAT';
        }
        token.value += l.src[token.end];
        token.end++;
    }
    l.i = token.end;
    token.end--;
    return token;
}


const kwdOrId = (l: LexingContext): Token => {
    let token = new Token('ID', '', l.i, l.i, l.line);

    while (
        token.end < l.src.length && 
        (isAlphabet(l.src[token.end]) || isDigit(l.src[token.end]) || l.src[token.end] === '_' )
    ) {
        token.end++;
    }
    token.value = l.src.slice(l.i, token.end);

    // iterate over the KwdTokenKind array and check if the token is a keyword
    if (token.value === "let") {
        token.kind = 'let';
    } else if (token.value === "var") {
        token.kind = 'var';
    } else {
        token.kind = 'ID';
    }
    l.i = token.end;
    token.end--;
    return token;
}


export const lexFile = (l: LexingContext) => {

    while (l.i < l.src.length) {
        let c = l.src[l.i];
        let token: Token;

        // Whitespace & New line
        if (c === ' ' || c === '\t' || c === '\r' || c === '\n') {
            ws(l);

        // Single line comment
        } else if (l.src.startsWith('--', l.i)) {
            while (l.i < l.src.length && l.src[l.i] !== '\n') {
                l.i++;
            }

        // Multi line comment
        } else if (l.src.startsWith('-[', l.i)) {
            while (true) {
                if (l.i >= l.src.length) {
                    let error = new UnclosedDelimiterError('Multiline Comment', ']-', l.filepath, l.i, l.line);
                    l.errors.push(error);
                    break;
                }
                
                if (l.src.startsWith(']-', l.i)) {
                    l.i += 2;
                    break;
                }
                ws(l);
                l.i++;
            }

        } else if (c === '=') {
            token = new Token('=','=', l.i, l.i, l.line);
            l.tokens.push(token);
            l.i++;

        } else if (isDigit(c)) {
            token = number(l);
            l.tokens.push(token);
        
        } else if (isAlphabet(c) || c === '_') {
            token = kwdOrId(l);
            l.tokens.push(token);

        } else {
            let error = new IllegalTokenError(c, l.filepath, l.i, l.line);
            l.errors.push(error);
            l.i++;
        }

    }
    
}

