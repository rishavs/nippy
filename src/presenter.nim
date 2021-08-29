import defs 

proc present*(lexRes: (CErrors, CTokens, CMeta)): bool =
    let (lexErrors, lexTokens, lexMeta) = lexRes
    # echo lexErrors
    # echo lexTokens
    for token in lexTokens:
        echo token.value
    if lexErrors.len > 0:
        echo "Errors found"
        echo lexErrors.len, " Errors Found: ", lexErrors[0].kind, " On line ", lexErrors[0].line
        return false
    else :
        echo "Tokens Found"
        echo lexTokens
        return true
