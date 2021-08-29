# line 177
import defs, tables

proc lex* (src: string) =
    var
        pos = 0
        line = 0
        chunk = ""
        bag: seq[string]
        isComment = 0 # 1 = single line comment open, 2 = multi line comment open
        isString = 0 # 1 = string open, 2 = interpolation open

    # handle newline separately
    if src[pos] == '\n':
        inc line

    while pos < src.len:

        if pos + 2 < src.len  :
            #  handle comments
            if isComment == 0   and src[pos] == '~' and src[pos + 1] == '~' :
                isComment = 1
            elif isComment == 0 and src[pos] == '~' and src[pos + 1] == '/' :
                isComment = 2
            elif isComment == 1 and src[pos] == '\n':
                isComment = 0
                pos = pos + 1
            elif isComment == 2 and src[pos] == '/' and src[pos + 1] == '~':
                isComment = 0
                pos = pos + 2

            # handle strings
            # elif isString = 0 

        #  now chunkit, baby

        # if isComment != 0:
        # else:
        #     case isString:
        #     of 2:
        #     of 1:
        #     of 0:

        if not (src[pos] in whitespace) and isComment == 0: 
            chunk.add src[pos]  

        if pos + 1 < src.len and (doubleSymbols.hasKey($src[pos] & $src[pos + 1])):
            if isComment == 0: 
                chunk.add $src[pos + 1]

            if chunk.len > 0:
                bag.add chunk
            chunk = ""
            pos = pos + 1

        elif pos + 1 < src.len and (singleSymbols.hasKey($src[pos])):
            if chunk.len > 0:
                bag.add chunk
            chunk = ""

        elif src[pos] in alphanum:
            if pos + 1 < src.len and (src[pos + 1] in whitespace or singleSymbols.hasKey $src[pos + 1]):
                if chunk.len > 0:
                    bag.add chunk
                chunk = ""
    
        pos = pos + 1

    echo bag

proc tokenize* (src: string): (CErrors, CTokens, CMeta) =
    var 
        errorsList:CErrors 
        tokensList:CTokens
        metadataList:CMeta
        pos = 0
        peak = 0
        isCommentOpen = 0 # 1 = single line comment open, 2 = multi line comment open
        isStringOpen = false
        isInterpolationOpen = false
        line = 1
        linePos = 1


    while pos < src.len:
        var chunk = ""
        peak = pos

        # handle newline separately
        if src[pos] == '\n':
            inc line

        if isCommentOpen == 2:
            if src[pos] == '/' and src[pos + 1] == '~':
                isCommentOpen = 0
                pos = pos + 2
            else:
                # if comment is open, just consume character and move ahead
                pos = pos + 1
        elif isCommentOpen == 1:
            if src[pos] == '\n':
                isCommentOpen = 0
                pos = pos + 1
            else:
                # if comment is open, just consume character and move ahead
                pos = pos + 1
        else:
            case src[pos]:
            of ' ', '\t', '\r':
                pos = pos + 1

            # double char symbols
            of '~':
                case src[pos + 1]:
                of '~':
                    pos = pos + 2
                    isCommentOpen = 1
                of '/':
                    pos = pos + 2
                    isCommentOpen = 2
                else:
                    errorsList.add CError(
                        kind: "SyntaxError",
                        message: "Unrecognised character",
                        value: $src[pos],
                        line: line
                    )
                    pos = pos + 1

            of '/':
                if src[pos + 1] == '/':
                    tokensList.add CToken(
                        kind       : "FLOOR_DIV",
                        value      : "//",
                        line       : line,
                        filePos     : pos,
                        length      : 2
                    )
                    pos = pos + 2
                else: 
                    tokensList.add CToken(
                        kind       : "DIV",
                        value      : "/",
                        line       : line,
                        filePos     : pos,
                        length      : 1
                    )
                    pos = pos + 1

            of '`':
                if isStringOpen == false:
                    if src[pos + 1] == '`':
                        isStringOpen = true
                        chunk = ""
                        peak = pos + 2
                        while not (src[peak  ] == '`' and src[peak + 1] == '`') and peak + 1 < src.len:
                            chunk.add src[peak]
                            peak = peak + 1

                        echo chunk
                        tokensList.add CToken(
                            kind       : "STRING_TEXT",
                            value      : chunk,
                            line       : line,
                            filePos     : pos,
                            length      : chunk.len
                        )
                        pos = pos + chunk.len

                else:
                    if src[pos + 1] == '`':
                        isStringOpen = false
                        tokensList.add CToken(
                            kind       : "STRING_END",
                            value      : "``",
                            line       : line,
                            filePos     : pos,
                            length      : 2
                        )
                        pos = pos + 2

                case src[pos + 1]:
                of '/':
                    pos = pos + 2
                    isCommentOpen = 2
                else:
                    errorsList.add CError(
                        kind: "SyntaxError",
                        message: "Unrecognised character",
                        value: $src[pos],
                        line: line
                    )
                    pos = pos + 1
            of '=': 
                if src[pos + 1] == '=':
                    tokensList.add CToken(
                        kind       : "EQUALS",
                        value      : "==",
                        line       : line,
                        filePos     : pos,
                        length      : 2
                    )
                    pos = pos + 2
                else:
                    tokensList.add CToken(
                        kind       : "ASSIGN",
                        value      : "=",
                        line       : line,
                        filePos     : pos,
                        length      : 1
                    )
                    pos = pos + 1

            # of '-': 
            #     discard
            # of '^': 
            #     discard
            # of '!':
            #     discard 
            # of '<': 
            #     discard
            # of '>': 
            #     discard

            # # Single chr symbols
            # Lets not do ingterpolation for now. its dirty biznez
            # Some of these may need to be upgraded to double symbols
            of '+', '*' , '%', '(', ')', '[', ']', ',', '{', '}', ':', '|': 
                tokensList.add CToken(
                    kind       : singleSymbols[$src[pos]],
                    value      : $src[pos],
                    line       : line,
                    filePos     : pos,
                    length      : 1
                )
                pos = pos + 1
            #     discard
            # of '.': 
            #     discard
            # of '0', '1', '2', '3', '4', '5', '6', '7', '8', '9':
            #     discard
            # of 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z':
            #     chunk = ""
            #     peak = pos
            #     while not (src[peak + 1] in whitespace) or src[peak + 1] == '`') and peak + 1 < src.len:
            #         chunk.add src[peak]
            #         peak = peak + 1

            #     echo chunk
            #     tokensList.add CToken(
            #         kind       : "STRING_TEXT",
            #         value      : chunk,
            #         line       : line,
            #         filePos     : pos,
            #         length      : chunk.len
            #     )
            #     pos = pos + chunk.len

            #     discard
            # of '_':
            #     discard
            # of '\n':
            #     inc line
            #     pos = pos + 1
            else:
                # Unrecognised character
                pos = pos + 1

    return (errorsList, tokensList, metadataList )
