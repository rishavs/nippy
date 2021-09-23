import tables, times

type
    CToken* = object
        kind*       : string
        value*      : string
        line*       : int
        filePos*    : int
        length*     : int

    CError* = object
        kind*       : string
        message*    : string
        hint*       : string
        value*      : string
        line*       : int
        filePos*    : int
        linePos*    : int
        uLineStartPos*    : int
        uLineEndPos*    : int
        line1Txt*   : string
        line2Txt*   : string
        line3Txt*   : string
        line4Txt*   : string
        line5Txt*   : string

    CMeta* = object
        lexTime*        : Duration
        parseTime*      : Duration
        linesCompiled*  : int

    Lexer* = object
        source*: string
        tokens*: seq[CTokens]
        start*, current*, line*: int

    CTokens* = seq[CToken]
    CErrors* = seq[CError]

let alphabets* = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '_']
let digits* = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', ',']

let alphanum* = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '_', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

let whitespace* = ['\n', ' ', '\t', '\r']

let allSymbols* = ['[', ']', '(', ')', '{', '}', '<', '>', '|', '&', '!', ':', '^', '*', ',', '.', '=', '-',  '+', '/',  '%']

let keywords* = {
    "Bool"  : "TYPE_BOOL",
    "Text"  : "TYPE_TEXT",
    "List"  : "TYPE_LIST",

    "Dec"   : "TYPE_DECIMAL",
    "Fun"   : "TYPE_FUNCTION",
    "Int"   : "TYPE_INTEGER",
    "var"   : "VARIABLE",

}.toOrderedTable

let doubleSymbols* = {
    "!="    : "NOT_EQUALS",
    "=="    : "EQUALS",
    ">="    : "GREATER_THAN_OR_EQUALS",
    "<="    : "LESS_THAN_OR_EQUALS",
    "<<"    : "LEFT_SHIFT",
    ">>"    : "RIGHT_SHIFT",
    "^&"    : "BITWISE_AND",
    "^|"    : "BITWISE_OR",
    "^^"    : "BITWISE_XOR",
    "^!"    : "BITWISE_CLEAR",
    "->"    : "ARROW",
    "=>"    : "DOUBLE_ARROW",
    "=~"    : "MATCHES",
    "!~"    : "DOESNT_MATCHES",
    ".."    : "RANGE",
    "{{"    : "INTERPOL_START",
    "}}"    : "INTERPOL_END",
}.toTable

let singleSymbols* = {
    "="     : "ASSIGN",
    "+"     : "PLUS",
    "-"     : "MINUS",
    "*"     : "STAR",
    "/"     : "FORWARD_SLASH",
    "%"     : "MODULUS",
    "^"     : "EXPONENT",
    "{"     : "BLOCK_START",
    "}"     : "BLOCK_END",
    "("     : "LEFT_PARENS",
    ")"     : "RIGHT_PARENS",
    "["     : "LEFT_BRACKET",
    "]"     : "RIGHT_BRACKET",
    ","     : "COMMA",
    "."     : "DOT",
    ":"     : "TYPE_DEF",
    "&"     : "AND",
    "|"     : "OR",
    "!"     : "NOT",
    "<"     : "LESS_THAN",
    ">"     : "GREATER_THAN",
}.toTable
