import defs 

proc present*(lexRes: (CErrors, CTokens)): bool =
    let (lexErrors, lexTokens) = lexRes
    if lexErrors.len > 0:
        echo "Errors found"
        echo "Errors Found: ", lexErrors[0].kind, " On line ", lexErrors[0].line
        return false
    else :
        echo "Tokens Found"
        echo lexTokens
        return true
