import defs

proc parse*(lexRes: (CErrors, CTokens)): (CErrors, CTokens) =
    return lexRes