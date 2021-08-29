import defs

proc parse*(lexRes: (CErrors, CTokens, CMeta)): (CErrors, CTokens, CMeta) =
    return lexRes