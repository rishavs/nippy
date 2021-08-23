import defs


# proc getChunk(src: string, pos: int): string =
#     var chunk: string
#     while pos < src.len:
#         if singleSymbols.hasKey($src[pos])) or whitespace.hasKey($src[pos])
#         chunk.add src[pos]
#         inc pos

#     return chunk
        
# proc lookBehind(numchars):

# proc peekAhead(charsNum):
#     true

# proc moveAhead(charsNum):
#     ""

# proc commitToken():
#     ""

# Keep looking ahead till we meet a whitespace or file end or a symbol
# proc getChunk (pos: int, source: string): string =
#     var chunk: string
#     var startPos = pos



#     while not singleSymbols.hasKey(char) and not whitespace.hasKey(char) :
#         chunk.add(source[startPos])
#         inc currPos

#     var currPos = startPos + 1
#     return chunk

# proc matches (str: string, pos: int) =
#     [`\n`, ` `, `\t`, `\r`]


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

    while currentPos < src.len :
        currentLineText.add src[currentPos]

        # echo src[currentPos]

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
                echo "Multi line comment CLOSED on line ", lineNum
        elif isSingleLineCommentOpen == false and isMultiLineCommentOpen == false:
            # if isStringDelimiterOpen == false and isStringInterpolationOpen == true:
                # This branch doesn't exists
            if isStringDelimiterOpen == true and isStringInterpolationOpen == false:
                # comment open & string closure & interpol open
                if currentPos > 0 and src[currentPos - 1] == '~' and src[currentPos] == '~':
                    isSingleLineCommentOpen = true
                    echo "Single line comment OPENED on line ", lineNum
                elif currentPos > 0 and src[currentPos - 1] == '~' and src[currentPos] == '/':
                    isMultiLineCommentOpen = true
                    echo "Multi line comment OPENED on line ", lineNum
                elif currentPos > 0 and src[currentPos - 1] == '`' and src[currentPos] == '`':
                    isStringDelimiterOpen = false
                    echo "String CLOSED on line ", lineNum
                elif currentPos > 0 and src[currentPos - 1] == '{' and src[currentPos] == '{':
                    isStringInterpolationOpen = true
                    echo "Interpolation OPENED on line ", lineNum

            elif isStringDelimiterOpen == true and isStringInterpolationOpen == true:
                # Interpol closure & Normal code chunking 
                if currentPos > 0 and src[currentPos - 1] == '}' and src[currentPos] == '}':
                    isStringInterpolationOpen = false
                    echo "Interpolation CLOSED on line ", lineNum
            elif isStringDelimiterOpen == false and isStringInterpolationOpen == false:    
                #  Normal code chunking & comment open & string open
                if currentPos > 0 and src[currentPos - 1] == '~' and src[currentPos] == '~':
                    isSingleLineCommentOpen = true
                    echo "Single line comment OPENED on line ", lineNum
                elif currentPos > 0 and src[currentPos - 1] == '~' and src[currentPos] == '/':
                    isMultiLineCommentOpen = true
                    echo "Multi line comment OPENED on line ", lineNum
                elif currentPos > 0 and src[currentPos - 1] == '`' and src[currentPos] == '`':
                    isStringDelimiterOpen = true
                    echo "String OPENED on line ", lineNum
                else:
                    discard
            # else: isSingleLineCommentOpen == true and isMultiLineCommentOpen == true:
                # This branch doesn't exists
            
        # Handle new lines
        if src[currentPos] == '\n':
            lineTxt[0] = lineTxt[1]
            lineTxt[1] = lineTxt[2]
            lineTxt[2] = currentLineText
            inc lineNum
            linePos = 0

        # echo src[currentPos]
        inc currentPos

    let err = CError(kind: "CompileError", message: "Compile went wrong")
    let token = CToken(kind: "test")

    errorsList.add(err)
    tokensList.add(token)
    return (errorsList, tokensList)
