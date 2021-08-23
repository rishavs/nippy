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

    Lexer* = object
        source*: string
        tokens*: seq[CTokens]
        start*, current*, line*: int

    CTokens* = seq[CToken]
    CErrors* = seq[CError]



let keywords* = {
    "Bool"  : "TYPE_BOOL",
    "Text"  : "TYPE_TEXT",
    "List"  : "TYPE_LIST",

    "Dec"   : "TYPE_DECIMAL",
    "Fun"   : "TYPE_FUNCTION",
    "Int"   : "TYPE_INTEGER",
    "Nil"   : "TYPE_NIL",

}.toOrderedTable

let combinedSymbols* = {
    "!="    : "NOT_EQUALS",
    "||"    : "OR",
    "&&"    : "AND",
    "=="    : "EQUALS",
    ">="    : "GREATER_THAN_OR_EQUALS",
    "<="    : "LESS_THAN_OR_EQUALS",
}.toTable

let singleSymbols* = {
    "="     : "ASSIGN",
    "+"     : "PLUS",
    "-"     : "MINUS",
    "*"     : "STAR",
    "/"     : "FORWARD_SLASH",
    "{"     : "LEFT_BRACE",
    "}"     : "RIGHT_BRACE",
    "("     : "LEFT_PARENS",
    ")"     : "RIGHT_PARENS",
    "["     : "LEFT_BRACKET",
    "]"     : "RIGHT_BRACKET",
    ","     : "COMMA",
    "."     : "DOT",
    ":"     : "COLON",
    "!"     : "NOT",
    "<"     : "LESS_THAN",
    ">"     : "GREATER_THAN",
}.toTable

let whitespace* = {
    "\n"     : "WHITESPACE",
    " "      : "WHITESPACE",
    "\t"     : "WHITESPACE",
    "\r"     : "WHITESPACE",
}.toTable

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