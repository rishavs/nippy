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
        lexTime*        : int
        parseTime*      : int
        linesCompiled*  : int


    Lexer* = object
        source*: string
        tokens*: seq[CTokens]
        start*, current*, line*: int

    CTokens* = seq[CToken]
    CErrors* = seq[CError]

let alphabets* = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '_']
let digits* = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', ',']

let alphanum* = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '_', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', ',']

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

# let whitespace* = {
#     "\n"     : "WHITESPACE",
#     " "      : "WHITESPACE",
#     "\t"     : "WHITESPACE",
#     "\r"     : "WHITESPACE",
# }.toTable

# TokType = enum
#     INVALID = "Invalid", EOF = "[EOF]", Symbol = "Symbol",
#     Addr = "addr", And = "and", As = "as", Asm = "asm", Bind = "bind",
#     Block = "block", Break = "break", Case = "case", Cast = "cast",
#     Concept = "concept", Const = "const", Continue = "continue",
#     Converter = "converter", Defer = "defer", Discard = "discard",
#     Distinct = "distinct", Div = "div", Do = "do", Elif = "elif",
#     Else = "else", End = "end", Enum = "enum", Except = "except",
#     Export = "export", Finally = "finally", For = "for", From = "from",
#     Func = "func", If = "if", Import = "import", In = "in",
#     Include = "include", Interface = "interface", Is = "is",
#     Isnot = "isnot", Iterator = "iterator", Let = "let", Macro = "macro",
#     Method = "method", Mixin = "mixin", Mod = "mod", Nil = "nil",
#     Not = "not", Notin = "notin", Object = "object", Of = "of",
#     Or = "or", Out = "out", Proc = "proc", Ptr = "ptr", Raise = "raise",
#     Ref = "ref", Return = "return", Shl = "shl", Shr = "shr",
#     Static = "static", Template = "template", Try = "try",
#     Tuple = "tuple", Type = "type", Using = "using", Var = "var",
#     When = "when", While = "while", Xor = "xor", Yield = "yield",
#     IntLit = "IntLit", Int8Lit = "Int8Lit", Int16Lit = "Int16Lit",
#     Int32Lit = "Int32Lit", Int64Lit = "Int64Lit", UIntLit = "UIntLit",
#     UInt8Lit = "UInt8Lit", UInt16Lit = "UInt16Lit",
#     UInt32Lit = "UInt32Lit", UInt64Lit = "UInt64Lit",
#     FloatLit = "FloatLit", Float32Lit = "Float32Lit",
#     Float64Lit = "Float64Lit", Float128Lit = "Float128Lit",
#     StrLit = "StrLit", RStrLit = "RStrLit",
#     TripleStrLit = "TripleStrLit", GStrLit = "GStrLit",
#     GTripleStrLit = "GTripleStrLit", CharLit = "CharLit", ParLe = "(",
#     ParRi = ")", BracketLe = "[", BracketRi = "]", CurlyLe = "{",
#     CurlyRi = "}", BracketDotLe = "[.", BracketDotRi = ".]",
#     CurlyDotLe = "{.", CurlyDotRi = ".}", ParDotLe = "(.",
#     ParDotRi = ".)", Comma = ",", SemiColon = ";", Colon = ":",
#     ColonColon = "::", Equals = "=", Dot = ".", DotDot = "..",
#     BracketLeColon = "[:", Opr, Comment, Accent = "`", Spaces,
#     InfixOpr, PrefixOpr, PostfixOpr