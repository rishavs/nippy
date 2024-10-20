
// --------------------------------------
// Base Error
// --------------------------------------
export class TranspilingError extends Error {
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