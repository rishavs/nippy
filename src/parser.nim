import defs, times

proc parse*(lexRes: (CErrors, CTokens, CMeta)): (CErrors, CTokens, CMeta) =
    # start timer
    let parseStartTime = getTime() 

    var (lexErrors, lexTokens, lexMeta) = lexRes

    lexMeta.parseTime = getTime() - parseStartTime
    return lexRes