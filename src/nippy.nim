import lexer, parser, presenter, times

let srcFile = readFile("./tests/adder.nip")

# let compileStartTime = getTime()


var result:bool = lex(srcFile)
    .parse
    .present

# lex(srcFile)

# echo "Time taken for Compilation: ", getTime() - compileStartTime

if result:
    quit(QuitSuccess)
else:
    quit(QuitFailure)


