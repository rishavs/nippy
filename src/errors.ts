
// --------------------------------------
// Base Error
// --------------------------------------
export abstract class TranspilingError extends Error {
    at: number;
    line: number;
    filepath: string;

    constructor(msg: string, filepath: string, at: number, line: number) {
        super(msg);

        this.filepath = filepath;
        this.at = at;   
        this.line = line;
        this.name = "Transpiling Error";
        
        // Modify the stack trace to exclude the constructor call
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, TranspilingError);
        }
    }
}

// --------------------------------------
// All Error Definitions
// --------------------------------------

export class UnhandledError extends TranspilingError {
    constructor(filepath:string , at: number, line: number) {
        super('Found an unhandled error at ' + at + ' on line ' + line, filepath, at, line);
        this.cause = 'This is a bug in the compiler! Please report.'
        this.name = "Unhandled Error";

        // Modify the stack trace to exclude the constructor call
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UnhandledError);
        }
    }
}

// --------------------------------------
// Lexer Errors
// --------------------------------------
export class IllegalTokenError extends TranspilingError {
    constructor(token: string, filepath:string , at: number, line: number) {
        super(`Found illegal token "${token}", at ${line}:${at}`, filepath, at, line);
        this.name = "Syntax Error";
        
        // Modify the stack trace to exclude the constructor call
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, IllegalTokenError);
        }
    }
}

export class UnclosedDelimiterError extends TranspilingError {
    constructor(syntaxKind: string, delimiter: string, filepath:string , at: number, line: number) {
        
        super(`Unclosed ${syntaxKind} at ${line}:${at}`, filepath, at, line);
        this.name = "Syntax Error";
        this.cause = `Expected closing delimiter "${delimiter}" before end of input`;
        
        // Modify the stack trace to exclude the constructor call
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UnclosedDelimiterError);
        }
    }
}


// --------------------------------------
// Parser Errors
// --------------------------------------

export class MissingSyntaxError extends TranspilingError {
    ok: boolean = false
    constructor(expectedSyntax: string, filepath:string, at: number, line: number, found?: string, ) {
        let expected = `Expected ${expectedSyntax} at ${line}:${at} ,`
        let got = found
            ? `but instead found "${found}"` 
            : `but instead reached end of input`
        super(expected + got, filepath, at, line);
        this.name = "Syntax Error";
        
        // Modify the stack trace to exclude the constructor call
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, MissingSyntaxError);
        }
    }
}

export class MissingSpecificTokenError extends TranspilingError {
    ok: boolean = false
    constructor(expectedSyntax: string, expectedTokenKind: string, filepath:string, at: number, line: number, found?: string) {
        let expected = `Expected ${expectedTokenKind} for ${expectedSyntax} at ${line}:${at},`
        let got = found
            ? `but instead found "${found}"` 
            : `but instead reached end of input`
        super(expected + got, filepath, at, line);
        this.name = "Syntax Error";
        
        // Modify the stack trace to exclude the constructor call
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, MissingSpecificTokenError);
        }
    }
}

// --------------------------------------
// Symbol building Errors
// --------------------------------------
export class MissingSymbolInitializationError extends TranspilingError {
    constructor(symbol: string, filepath:string , at: number, line: number) {
        super(`Missing initialization for the symbol "${symbol}" at ${line}:${at}`, filepath, at, line);
        this.name = "Declaration Error";
        
        // Modify the stack trace to exclude the constructor call
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, MissingSymbolInitializationError);
        }
    }
}

export class SymbolRedeclarationError extends TranspilingError {
    constructor(symbol: string, filepath:string , at: number, line: number) {
        super(`Previously declared Symbol "${symbol}" is being redeclared at ${line}:${at}`, filepath, at, line);
        this.name = "Declaration Error";
        
        // Modify the stack trace to exclude the constructor call
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, SymbolRedeclarationError);
        }
    }
}