# line 177
import defs, tables, times

proc lex* (src: string):(CErrors, CTokens, CMeta) =

    # start timer
    let lexStartTime = getTime()

    type
        ProgramMode = enum
            code, slComment, mlComment, text, interpolCode, interpolText
        ChunkType = enum
            cIdent, cNum, cUnknown

    var
        chunk = ""
        pos = 0
        currChar, nextChar: char
        line = 1
        currLineStr = ""
        lastLineStr = ""
        lastMin1LineStr = ""
        bag: seq[string]
        mode: ProgramMode = code
        ctype: ChunkType = cUnknown
        isChunkAlphaNum: bool = false
        tokens: seq[CToken]
        errors: seq[CError]

    while pos + 1 <= src.len:

        case mode:
        of slComment:
            if src[pos] == '\n':
                # echo "Closing SL Comment at line ", line
                mode = code

        of mlComment:
            if  src[pos] == '/' and src[pos + 1] == '~':
                # echo "Closing ML Comment at line ", line
                mode = code
                pos = pos + 1

        of text:
            if src[pos] == '`' and src[pos + 1] == '`':
                # echo "Closing String at line ", line
                mode = code
                if chunk != "": 
                    bag.add chunk
                    tokens.add CToken(
                        kind       : "TEXT",
                        value      : chunk,
                        line       : line,
                        filePos     : pos,
                        length      : chunk.len
                    )
                chunk = ""
                pos = pos + 1
            elif src[pos] == '{' and src[pos + 1] == '{':
                # echo "Opening Interpol at line ", line
                mode = interpolCode
                if chunk != "": 
                    bag.add chunk
                    tokens.add CToken(
                        kind       : "TEXT",
                        value      : chunk,
                        line       : line,
                        filePos     : pos,
                        length      : chunk.len
                    )
                chunk = ""
                pos = pos + 1
            else:
                chunk.add src[pos]

        of code:
            if src[pos] == '~' and src[pos + 1] == '~' :
                # echo "Opening SL Comment at line ", line
                mode = slComment
                pos = pos + 1
            elif  src[pos] == '~' and src[pos + 1] == '/' :
                # echo "Opening ML Comment at line ", line
                mode = mlComment
                pos = pos + 1
            elif src[pos] == '`' and src[pos + 1] == '`':
                # echo "Opening String at line ", line
                mode = text
                pos = pos + 1

            # lex the code
            # elif double symbol
            elif doubleSymbols.hasKey(src[pos] & src[pos + 1]):
                var dubSym = (src[pos] & src[pos + 1])
                bag.add dubSym
                tokens.add CToken(
                    kind        : doubleSymbols[dubSym],
                    value       : dubSym,
                    line        : line,
                    filePos     : pos,
                    length      : 2
                )
                pos = pos + 1

            # handle alphanumerics
            elif src[pos] in alphanum:
                chunk.add src[pos]
                isChunkAlphaNum = true
            # handle whitespace 
            elif src[pos] in whitespace:
                if chunk != "": 
                    bag.add chunk
                    if isChunkAlphaNum == true:
                        if keywords.hasKey(chunk):
                            tokens.add CToken(
                                kind        : keywords[chunk],
                                value       : chunk,
                                line        : line,
                                filePos     : pos,
                                length      : chunk.len
                            )
                        else:
                            tokens.add CToken(
                                kind        : "ALPHANUM",
                                value       : chunk,
                                line        : line,
                                filePos     : pos,
                                length      : chunk.len
                            )
                isChunkAlphaNum = false
                chunk = ""
            # handle symbols and everything else
            else:
                if chunk != "": 
                    bag.add chunk
                    if isChunkAlphaNum == true:
                        if keywords.hasKey(chunk):
                            tokens.add CToken(
                                kind        : keywords[chunk],
                                value       : chunk,
                                line        : line,
                                filePos     : pos,
                                length      : chunk.len
                            )
                        else:
                            tokens.add CToken(
                                kind        : "ALPHANUM",
                                value       : chunk,
                                line        : line,
                                filePos     : pos,
                                length      : chunk.len
                            )
                isChunkAlphaNum = false
                chunk = ""
                bag.add $src[pos]
                if singleSymbols.hasKey($src[pos]):
                    tokens.add CToken(
                        kind        : singleSymbols[$src[pos]],
                        value       : $src[pos],
                        line        : line,
                        filePos     : pos,
                        length      : 1
                    )
                else:
                    tokens.add CToken(
                        kind        : "UNKNOWN_SYMBOL",
                        value       : $src[pos],
                        line        : line,
                        filePos     : pos,
                        length      : 1
                    )

        of interpolCode:
            if src[pos] == '`' and src[pos + 1] == '`':
                # echo "Opening Interpol String at line ", line
                mode = interpolText
                pos = pos + 1
            elif src[pos] == '}' and src[pos + 1] == '}':
                # echo "Closing Interpol at line ", line
                mode = text
                pos = pos + 1
            
            # lex the code
            # elif double symbol
            elif doubleSymbols.hasKey(src[pos] & src[pos + 1]):
                var dubSym = (src[pos] & src[pos + 1])
                bag.add dubSym
                tokens.add CToken(
                    kind        : doubleSymbols[dubSym],
                    value       : dubSym,
                    line        : line,
                    filePos     : pos,
                    length      : 2
                )
                pos = pos + 1
            # handle alphanumerics
            elif src[pos] in alphanum:
                chunk.add src[pos]
            # handle whitespace 
            elif src[pos] in whitespace:
                if chunk != "": 
                    bag.add chunk
                    if isChunkAlphaNum == true:
                        if keywords.hasKey(chunk):
                            tokens.add CToken(
                                kind        : keywords[chunk],
                                value       : chunk,
                                line        : line,
                                filePos     : pos,
                                length      : chunk.len
                            )
                        else:
                            tokens.add CToken(
                                kind        : "ALPHANUM",
                                value       : chunk,
                                line        : line,
                                filePos     : pos,
                                length      : chunk.len
                            )
                isChunkAlphaNum = false
                chunk = ""
            # handle symbols and everything else
            else:
                if chunk != "": 
                    bag.add chunk
                    if isChunkAlphaNum == true:
                        if keywords.hasKey(chunk):
                            tokens.add CToken(
                                kind        : keywords[chunk],
                                value       : chunk,
                                line        : line,
                                filePos     : pos,
                                length      : chunk.len
                            )
                        else:
                            tokens.add CToken(
                                kind        : "ALPHANUM",
                                value       : chunk,
                                line        : line,
                                filePos     : pos,
                                length      : chunk.len
                            )
                isChunkAlphaNum = false
                chunk = ""
                bag.add $src[pos]
                if singleSymbols.hasKey($src[pos]):
                    tokens.add CToken(
                        kind        : singleSymbols[$src[pos]],
                        value       : $src[pos],
                        line        : line,
                        filePos     : pos,
                        length      : 1
                    )
                else:
                    tokens.add CToken(
                        kind        : "UNKNOWN_SYMBOL",
                        value       : $src[pos],
                        line        : line,
                        filePos     : pos,
                        length      : 1
                    )


        of interpolText:
            if src[pos] == '`' and src[pos + 1] == '`':
                # echo "Closing Interpol String at line ", line
                mode = interpolCode
                if chunk != "": 
                    bag.add chunk
                    tokens.add CToken(
                        kind       : "TEXT",
                        value      : chunk,
                        line       : line,
                        filePos     : pos,
                        length      : chunk.len
                    )
                chunk = ""
                pos = pos + 1
            else:
                chunk.add src[pos]
            # no comments in interopl
            # no newline in interpol
            # handles string separately. text allowed as it can be func param
            # hanlde alphanum
            # handle symbols

        currLineStr.add src[pos]

        # handle newline separately
        if src[pos] == '\n': 
            inc line
            lastMin1LineStr = lastLineStr
            lastLineStr = currLineStr
            currLineStr = ""

        pos = pos + 1

    var metadata = CMeta(
            lexTime : getTime() - lexStartTime,
            linesCompiled: line
        )

    return (errors, tokens, metadata)
