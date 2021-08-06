import defs



# proc peekAhead():
#     true

# proc moveAhead():
#     ""

# proc commitToken():
#     ""



proc tokenize* (fileStr: string): (CErrors, CTokens) =
    var 
        errorsList:CErrors 
        tokensList:CTokens

    for i in fileStr:
        echo i


    let err = CError(kind: "CompileError", message: "Compile went wrong")
    let token = CToken(kind: "test")

    errorsList.add(err)
    tokensList.add(token)
    return (errorsList, tokensList)