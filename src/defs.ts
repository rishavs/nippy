import { BlockNode, RootNode } from "./ast";
import { TranspilingError } from "./errors"

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

export class LexingContext {
    src:        string;
    i:          number;
    line:       number;
    filepath:   string;

    errors: TranspilingError[] = [];
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

    errors: TranspilingError[] = [];
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

    constructor(filepath: string, program: RootNode) {
        this.program = program;
        this.filepath = filepath;
    }
}