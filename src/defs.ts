import type { TranspilingError } from "./errors"

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


