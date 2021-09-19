# line 177
import defs, tables

proc lex* (src: string) =
    # string done
    type
        ProgramMode = enum
            code, slComment, mlComment, text, interpolCode, interpolText

    var
        chunk = ""
        pos = 0
        line = 1
        bag: seq[string]
        mode: ProgramMode = code

    while pos + 1 <= src.len:

        case mode:
        of slComment:
            if src[pos] == '\n':
                echo "Closing SL Comment at line ", line
                mode = code

        of mlComment:
            if  src[pos] == '/' and src[pos + 1] == '~':
                echo "Closing ML Comment at line ", line
                mode = code
                pos = pos + 1

        of text:
            if src[pos] == '`' and src[pos + 1] == '`':
                echo "Closing String at line ", line
                mode = code
                if chunk != "": bag.add chunk
                chunk = ""
                pos = pos + 1
            elif src[pos] == '{' and src[pos + 1] == '{':
                echo "Opening Interpol at line ", line
                mode = interpolCode
                if chunk != "": bag.add chunk
                chunk = ""
                pos = pos + 1
            else:
                chunk.add src[pos]

        of code:
            if src[pos] == '~' and src[pos + 1] == '~' :
                echo "Opening SL Comment at line ", line
                mode = slComment
                pos = pos + 1
            elif  src[pos] == '~' and src[pos + 1] == '/' :
                echo "Opening ML Comment at line ", line
                mode = mlComment
                pos = pos + 1
            elif src[pos] == '`' and src[pos + 1] == '`':
                echo "Opening String at line ", line
                mode = text
                pos = pos + 1

            # lex the code
            # elif double symbol
            elif doubleSymbols.hasKey(src[pos] & src[pos + 1]):
                bag.add (src[pos] & src[pos + 1])
                pos = pos + 1
            # handle alphanumerics
            elif src[pos] in alphanum:
                chunk.add src[pos]
            # handle whitespace 
            elif src[pos] in whitespace:
                if chunk != "": bag.add chunk
                chunk = ""
            # handle symbols and everything else
            else:
                if chunk != "": bag.add chunk
                chunk = ""
                bag.add $src[pos]

        of interpolCode:
            if src[pos] == '`' and src[pos + 1] == '`':
                echo "Opening Interpol String at line ", line
                mode = interpolText
                pos = pos + 1
            elif src[pos] == '}' and src[pos + 1] == '}':
                echo "Closing Interpol at line ", line
                mode = text
                pos = pos + 1
            
            # lex the code
            # elif double symbol
            elif doubleSymbols.hasKey(src[pos] & src[pos + 1]):
                bag.add (src[pos] & src[pos + 1])
                pos = pos + 1
            # handle alphanumerics
            elif src[pos] in alphanum:
                chunk.add src[pos]
            # handle whitespace 
            elif src[pos] in whitespace:
                if chunk != "": bag.add chunk
                chunk = ""
            # handle symbols and everything else
            else:
                if chunk != "": bag.add chunk
                chunk = ""
                bag.add $src[pos]

        of interpolText:
            if src[pos] == '`' and src[pos + 1] == '`':
                echo "Closing Interpol String at line ", line
                mode = interpolCode
                bag.add chunk
                chunk = ""
                pos = pos + 1
            else:
                chunk.add src[pos]
            # no comments in interopl
            # no newline in interpol
            # handles string separately. text allowed as it can be func param
            # hanlde alphanum
            # handle symbols


        # handle newline separately
        if src[pos] == '\n': inc line

        pos = pos + 1
        
    echo bag


proc lexGood* (src: string) =
        
    type
        ProgramMode = enum
            code, slComment, mlComment, text

    var
        pos = 0
        line = 1
        chunk = ""
        bag: seq[string]
        mode: ProgramMode = code

    while pos + 1 < src.len:

        # handle newline separately
        if src[pos] == '\n': inc line

        # handle mode switches
        # case mode:
        # of slComment:
        # of mlComment:
        # of text:
        # of code:


        if src[pos] == '~' and src[pos + 1] == '~' :
            echo "Opening SL Comment at line ", line
            pos = pos + 2
            while pos <= src.len:
                if src[pos] == '\n':
                    echo "Closing SL Comment at line ", line
                    inc line
                    break
                else:
                    pos = pos + 1

        elif  src[pos] == '~' and src[pos + 1] == '/' :
            echo "Opening ML Comment at line ", line
            pos = pos + 2
            while pos + 1 < src.len:
                if src[pos] == '\n': inc line
                if  src[pos] == '/' and src[pos + 1] == '~':
                    echo "Closing ML Comment at line ", line
                    pos = pos + 1
                    break
                else:
                    pos = pos + 1
             
        elif  (src[pos] == '`' and src[pos + 1] == '`') or (src[pos] == '}' and src[pos + 1] == '}') :
            echo "Opening String at line ", line
            var chunk = ""
            pos = pos + 2
            while pos + 1 < src.len:
                if src[pos] == '\n': inc line

                if src[pos] == '`' and src[pos + 1] == '`': 
                    echo "Closing String at line ", line
                    pos = pos + 1
                    break
                elif src[pos] == '{' and src[pos + 1] == '{':
                    echo "Closing String at line ", line
                    pos = pos - 1
                    break
                else:
                    chunk.add src[pos]
                    pos = pos + 1
            bag.add chunk
            # echo src[pos], src[pos + 1]

        elif  src[pos] == '{' and src[pos + 1] == '{' :
            echo "Opening Interpol at line ", line
            # var chunk = ""

            #  [TODO] handle interpol like code block
            while pos + 1 < src.len:
                if src[pos] == '\n': inc line
                if src[pos] == '}' and src[pos + 1] == '}':
                    echo "Closing Interpol at line ", line
                    pos = pos - 1
                    break
                else:
                    pos = pos + 1

        # if char is a alhpanum - break into alphabet and num
        elif pos < src.len  and src[pos] in alphanum:
            chunk = ""
            # var next = pos
            while pos <= src.len:
                if not (src[pos] in alphanum):
                    break
                else:
                    chunk.add src[pos]
                    pos = pos + 1

            bag.add chunk
            pos = pos - 1

        # # if char is symbol
        elif not (src[pos] in whitespace) and not (src[pos] in alphanum):
            if doubleSymbols.hasKey(src[pos] & src[pos + 1]):
                bag.add (src[pos] & src[pos + 1])
                pos = pos + 1

            elif singleSymbols.hasKey($src[pos]):
                bag.add $src[pos]
            else:
                bag.add $src[pos]
                # Raise error - unrecognised character

        pos = pos + 1

    echo bag
