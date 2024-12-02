import { ASTNode, RootNode } from "./ast";
import type { TranspilingError } from "./errors";

export class Token {
    kind:   string;
    value:  string;
    start:  number;
    end:    number;
    line:   number;

    constructor(kind: string, value: string, start: number, end: number, line: number) {
        this.kind =     kind;
        this.value =    value;
        this.start =    start;
        this.end =      end;
        this.line =     line;
    }
}

export class TranspilingContext {
    errors: TranspilingError[] = [];
    
    filepath: string;
    src: string;
    cCode: string ='';

    // Lexer
    li: number = 0;
    line: number = 0;
    tokens: Token[] = [];

    // Parser
    pi: number = 0;
    root: RootNode = new RootNode(0, 0);

    // Codegen
    cFileCode   : string = "";
    hFileCode   : string = "";

    currentDepth: number = 0;

    usesString  : boolean = false;
    usesInt     : boolean = false;
    usesFloat   : boolean = false;

    exitCode    : number = 0;

    constructor(filepath: string, src: string) {
        this.filepath = filepath;
        this.src = src;
    }
}

export class LexingContext {
    src:        string;
    i:          number;
    line:       number;
    filepath:   string;

    tokens: Token[] = [];

    constructor(filepath: string, src: string ) {
        this.src =      src;
        this.i =        0;
        this.line =     0;
        this.filepath = filepath;
    }
}

export class ParsingContext {
    filepath: string;
    tokens: Token[];

    program: RootNode;
    i: number;
    currentDepth: number = 0;

    constructor(filepath:string, tokens: Token[]) {
        this.filepath = filepath;
        this.tokens = tokens;
        this.i = 0;

        this. program = new RootNode(0, 0);
    }
}

export class CodegenContext {
    cFileCode   : string = "";
    hFileCode   : string = "";

    program     : RootNode;
    filepath    : string;

    currentDepth: number = 0;

    usesString  : boolean = false;
    usesInt     : boolean = false;
    usesFloat   : boolean = false;

    exitCode    : number = 0;

    constructor(filepath: string, program: RootNode) {
        this.program = program;
        this.filepath = filepath;
    }
}

export class SymbolInfo {
    type: string;
    isMutable: boolean;

    node: ASTNode;

    constructor(type: string, isMutable: boolean, node: ASTNode) {
        this.type = type;
        this.isMutable = isMutable;
        this.node = node;
    }
}

export type SymbolsTable = Record<string, SymbolInfo>;