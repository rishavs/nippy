import tables

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
        line*       : int
        filePos*    : int
        linePos*    : int
        line1Txt*   : string
        line2Txt*   : string
        line3Txt*   : string
        line4Txt*   : string
        line5Txt*   : string

    CTokens* = seq[CToken]
    CErrors* = seq[CError]


let TokenTypes = {
    # Single-character tokens.
        "=": "ASSIGN",
        "+": "PLUS",
        "-": "MINUS",
        "*": "STAR",
        "/": "FORWARD_SLASH",
        "{": "LEFT_BRACE",
        "}": "RIGHT_BRACE",
        "(": "LEFT_PARENS",
        ")": "RIGHT_PARENS",
        "[": "LEFT_BRACKET",
        "]": "RIGHT_BRACKET",
        ",": "COMMA",
        ".": "DOT",
        ":": "COLON",
        "!": "NOT",
        "<": "LESS_THAN",
        ">": "GREATER_THAN",

    # One or two character tokens.
    # We will not add the comments symbols as they are to be stripped and are not really tokens
        "!=": "NOT_EQUALS",
        "||": "OR",
        "&&": "AND",
        "==": "EQUALS",
        ">=": "GREATER_THAN_OR_EQUALS",
        "<=": "LESS_THAN_OR_EQUALS",

    # 3 letters
        "SOF": "START_OF_FILE",
        "EOF": "END_OF_FILE",

    # Literals.
    # IDENTIFIER, STRING, NUMBER,

    # # Keywords.
    # AND, CLASS, ELSE, FALSE, FUN, FOR, IF, NIL, OR,
    # PRINT, RETURN, SUPER, THIS, TRUE, VAR, WHILE,



    # "": ""

}.toTable 