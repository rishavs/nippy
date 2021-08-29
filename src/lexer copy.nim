import defs, tables

proc tokenize* (src: string): (CErrors, CTokens) =
    var 
        errorsList:CErrors 
        tokensList:CTokens
        tokenStartPos   : int
        tokenLength     : int
        linePos         : int
        filePos         : int
        currentLineText : string
        lineTxt         : array[3, string]
        chunk           : string
        peakAtPos       : int
        lastChunkEnd    : int

    var 
        currentPos                  = 0
        lineNum                     = 1
        isSingleLineCommentOpen     = false
        isMultiLineCommentOpen      = false
        isStringDelimiterOpen       = false
        isStringInterpolationOpen   = false

    # For better perf moving this inside tokenise and reusing existing source and tokens list delcarations
    # returns the end pos of last chunk
    # a chunk of single letter, will have same start and end pos
    proc addNextToken(cursor: int): int =
        var pos = cursor
        var chunk = ""
        
        if src[pos] in whitespace:
            # get chunk. keep goimng till non whitespace reached
            while pos + 1 <= src.len and src[pos + 1] in whitespace:
                inc pos

            # ignore this token as the language doesn't cares about whitespace (only the lack of it)
        elif src[pos] in alphabets:
            # get chunk
            # if it is a keyword, mark as keyword
            # if it fulfills the criteria for ident, mark as identifier
            while pos + 1 <= src.len and src[pos] in alphabets:
                chunk.add src[pos]
                inc pos

            # If the next char is not a recognised symbol or whitespace, throw an error
            if not ( (singleSymbols.hasKey $src[pos + 1]) or (src[pos + 1] in whitespace) ) :
                errorsList.add CError(
                    kind       : "SyntaxError",
                    message    : "Nippy found a malformed keyword or identifier",
                    hint        : "Did you make a typo? In Nippy identifiers start with a letter and can only have alphabets and the '_' symbol.",
                    line       : lineNum
                )

            # if chunk is a keyword, idetify and recognise
            # if chunk is an identifier, identify and add token
            if chunk in keywords:
                tokensList.add CToken(
                    kind       : "KEYWORD",
                    value      : keywords[chunk],
                    line       : lineNum
                )
            else:
                tokensList.add CToken(
                    kind       : "MAYBE_IDENTIFIER",
                    value      : chunk,
                    line       : lineNum
                )

            #  else add as an unrecognised string.

        elif src[pos] in digits:
            while pos + 1 <= src.len and src[pos] in digits:
                chunk.add src[pos]
                inc pos

            # If the next char is not a recognised symbol or whitespace, throw an error
            if not ( (singleSymbols.hasKey $src[pos + 1]) or (src[pos + 1] in whitespace) ) :
                errorsList.add CError(
                    kind        : "SyntaxError",
                    message     : "Nippy found a malformed Number",
                    hint        : "Did you make a typo? In Nippy both Num and Dec types can only have 0..9 as digits and the symbols for ',' and '.'",
                    line        : lineNum
                )
        elif $(src[pos]) in singleSymbols:
            case src[pos]:
            of '!':
                discard
            of '=':
                discard
            of '<':
                discard
            of '>':
                discard
            of '^':
                discard
            of '-':
                discard
            of '.':
                discard
            else:
                discard
        # elif src[pos] == '\n':
        #     discard
        else:
            #  Throw error. Unrecognised character
            discard

        return pos


    while currentPos < src.len :
        currentLineText.add src[currentPos]

        # echo src[currentPos]

                    
        # Handle new lines
        if src[currentPos] == '\n':
            lineTxt[0] = lineTxt[1]
            lineTxt[1] = lineTxt[2]
            lineTxt[2] = currentLineText
            inc lineNum
            linePos = 0

        # let chunk: string = getChunk(src, currentPos) 

        # Comment   String	Interpol	
        # TRUE	    FALSE	FALSE	comment close
        # TRUE	    TRUE	FALSE	comment close
        # TRUE	    FALSE	TRUE	comment close
        # TRUE	    TRUE	TRUE	comment close
        # FALSE 	FALSE	FALSE	Normal Code
        # FALSE	    TRUE	FALSE	comment open & string closure & interpol open
        # FALSE	    FALSE	TRUE	shouldn't exist
        # FALSE	    TRUE	TRUE	Normal code & Interpol closure

        # If the single line comment is open, we only care about the line end
        if isSingleLineCommentOpen == true and isMultiLineCommentOpen == false:
            if src[currentPos] == '\n':
                isSingleLineCommentOpen = false
                echo "Single line comment CLOSED on line ", lineNum
        # if a multi line comment is open, we only care about the comment closure
        elif isSingleLineCommentOpen == false and isMultiLineCommentOpen == true:
            if currentPos > 0 and src[currentPos - 1] == '/' and src[currentPos] == '~':
                isMultiLineCommentOpen = false
                inc currentPos
                echo "Multi line comment CLOSED on line ", lineNum
        elif isSingleLineCommentOpen == false and isMultiLineCommentOpen == false:
            # if isStringDelimiterOpen == false and isStringInterpolationOpen == true:
                # This branch doesn't exists
            if isStringDelimiterOpen == true and isStringInterpolationOpen == false:
                # comment open & string closure & interpol open
                if currentPos > 0 and src[currentPos - 1] == '~' and src[currentPos] == '~':
                    isSingleLineCommentOpen = true
                    inc currentPos
                    echo "Single line comment OPENED on line ", lineNum
                elif currentPos > 0 and src[currentPos - 1] == '~' and src[currentPos] == '/':
                    isMultiLineCommentOpen = true
                    inc currentPos
                    echo "Multi line comment OPENED on line ", lineNum
                elif currentPos > 0 and src[currentPos - 1] == '`' and src[currentPos] == '`':
                    isStringDelimiterOpen = false
                    inc currentPos
                    echo "String CLOSED on line ", lineNum
                elif currentPos > 0 and src[currentPos - 1] == '{' and src[currentPos] == '{':
                    isStringInterpolationOpen = true
                    inc currentPos
                    echo "Interpolation OPENED on line ", lineNum
                else:
                    discard

            elif isStringDelimiterOpen == true and isStringInterpolationOpen == true:
                # Interpol closure & Normal code chunking 
                if currentPos > 0 and src[currentPos - 1] == '}' and src[currentPos] == '}':
                    isStringInterpolationOpen = false
                    inc currentPos
                    echo "Interpolation CLOSED on line ", lineNum
            elif isStringDelimiterOpen == false and isStringInterpolationOpen == false:    
                #  Normal code chunking & comment open & string open
                if currentPos > 0 and src[currentPos - 1] == '~' and src[currentPos] == '~':
                    isSingleLineCommentOpen = true
                    inc currentPos
                    echo "Single line comment OPENED on line ", lineNum
                elif currentPos > 0 and src[currentPos - 1] == '~' and src[currentPos] == '/':
                    isMultiLineCommentOpen = true
                    inc currentPos
                    echo "Multi line comment OPENED on line ", lineNum
                elif currentPos > 0 and src[currentPos - 1] == '`' and src[currentPos] == '`':
                    isStringDelimiterOpen = true
                    inc currentPos
                    echo "String OPENED on line ", lineNum
                else:
                    currentPos = addNextToken(currentPos)


            # else: isSingleLineCommentOpen == true and isMultiLineCommentOpen == true:
                # This branch doesn't exists


        # echo src[currentPos]
        inc currentPos

    return (errorsList, tokensList)
