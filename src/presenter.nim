import defs, times

proc present*(lexRes: (CErrors, CTokens, CMeta)): bool =
    let (lexErrors, lexTokens, lexMeta) = lexRes

    echo lexMeta
    echo "Time Taken for Lexing = ", lexMeta.lexTime
    echo "Time Taken for Parsing = ", lexMeta.parseTime
    echo "Total Time Taken for Compilation = ", lexMeta.lexTime + lexMeta.parseTime
    echo "For ", lexMeta.linesCompiled, " lines of code."

    # for token in lexTokens:
    #     echo token.value
    if lexErrors.len > 0:
        echo "Errors found"
        echo lexErrors.len, " Errors Found: ", lexErrors[0].kind, " On line ", lexErrors[0].line
        return false
    else :
        echo "Tokens Found"
        echo lexTokens
        return true
    

