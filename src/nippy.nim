import lexer, parser, presenter

let srcFile = readFile("./tests/adder.nip")

var result:bool = tokenize(srcFile)
    .parse
    .present

if result:
    quit(QuitSuccess)
else:
    quit(QuitFailure)


