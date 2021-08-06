
// ------------------------------
// Parsing Rules 
// ------------------------------
// ✓ An alphanum can touch a symbol
// X Two symbols can't touch each other unless they are for comments
// An alphanum ends with a symbol or whitepace
// whitespace and comments will be stripped
// newline will be conserved in the parsing stage

const fs = require('fs')



tokenize = (filePath, callback) => {
    let tokensList = [];
    let chunk = [];
    let lineNum = 1;
    let lineTxt = [];
    let openComment, openChunk; //takes none | singleLine | multiLine
    let openSingleLineComment = false
    let openMultiLineComment = false;
    let fileCommentStartPos, lineCommentStartPos;
    let fileChunkStartPos, lineChunkStartPos;
    let fileCurrentPos = 0;
    let lineCurrentPos = 0;
    let prevChar = null;
    let char;

    let isAlphaNumeric = (code) => {
        if (!(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123)) { // lower alpha (a-z)
            return false;
        }
        return true;
    };

    let isSymbol = (char) => {
        [`+`, `-`, `*`, `/`, `:`, `=`, `{`, `}`, `(`, `)`].includes(char)
    }

    let isWhitespace = (char) => {
        [`\n`, ` `, `\t`, `\r`].includes(char)
    }

    try {
        const data = fs.readFileSync(filePath, 'utf8')

        // For now we will go with a simple for loop and a preexisting string
        // in the proper self hosted parser, we would want to go with a stream and read the file per char
        for (char of data) {
            // console.log(char)
            // do {
            // console.log(char)
            fileCurrentPos++;
            lineCurrentPos++;

            // since there is only 1 char and thus no chance of multiple ifs being triggered
            // we can use a fallthrough style of ifs and skip the if-else tree
            if (prevChar == `~` && char == `~` && openSingleLineComment == false && openMultiLineComment == false) {
                openSingleLineComment = true;
                fileCommentStartPos = fileCurrentPos;
                lineCommentStartPos = lineCurrentPos;
                console.log("Single line comment STARTED on line", lineNum);
            } else if ((char == `\n` || char == null) && openSingleLineComment == true) {
                openSingleLineComment = false;
                console.log("Single line comment CLOSED on line", lineNum);
            } else if (prevChar == `~` && char == `/` && openSingleLineComment == false && openMultiLineComment == false) {
                openMultiLineComment = true;
                fileCommentStartPos = fileCurrentPos;
                lineCommentStartPos = lineCurrentPos;
                console.log("Multi line comment STARTED on line", lineNum);
            } else if (prevChar == `/` && char == `~` && openMultiLineComment == true) {
                openMultiLineComment = false;
                console.log("Multi line comment CLOSED on line", lineNum);
            } else if (![`\n`, ` `, `\t`, `\r`].includes(prevChar) && char == ` ` && openSingleLineComment == false && openMultiLineComment == false) {

                // Whitespace Rule. If previous char is not a whitespace, add existing chunk as a token. else skip
                console.log("Whitespace found. Skipping contiguous ones", lineNum);
                tokensList.push({
                    val: chunk,
                    line: lineNum,
                    filePos: fileCurrentPos,
                    linePos: lineCurrentPos
                });

            } else if ([`+`, `-`, `*`, `/`, `:`, `=`, `{`, `}`, `(`, `)`].includes(char) && openSingleLineComment == false && openMultiLineComment == false) {
                // Symbols rule. Symbols are always added as tokens
                console.log("Symbol found. Adding to list of tokens", lineNum);
                if (chunk.length != 0) {
                    tokensList.push({
                        val: chunk,
                        line: lineNum,
                        filePos: fileCurrentPos,
                        linePos: lineCurrentPos
                    });
                }
                chunk = [char];
                tokensList.push({
                    val: chunk,
                    line: lineNum,
                    filePos: fileCurrentPos,
                    linePos: lineCurrentPos
                });
                // console.log(tokensList)
            } else if (char == `\n` && openSingleLineComment == false && openMultiLineComment == false) {
                console.log("New Line found. Adding to list of tokens", lineNum);
            } else {
                // normal alphanum chars
                chunk.push(char)

            }

            prevChar = char;

            // } while ((char = stream.read(1)) != null);

        }
    } catch (err) {
        console.error(err)
    }

    console.log("Lines read: ", lineNum)
    console.log("Chars read: ", fileCurrentPos)
    // console.log(tokensList)
    // console.log(x)

    return tokensList;

}

module.exports = { tokenize };

    // let stream = fs.createReadStream(filePath, {
    //     encoding: 'utf8',
    //     fd: null,
    // });

    //     let commitToken = () => {
    //         if (chunk.length != 0) {
    //             token = {
    //                 val: chunk,
    //                 line: lineNum,
    //             }
    //             console.log("Adding token", token)
    //             tokens.push(token)
    //             console.log("Tokens List looks like", tokens)
    //         }
    //         chunk = []

    //     }

    //     stream.on('readable', function () {
    //         do {
    //             // console.log(char)
    //             fileCurrentPos++;
    //             lineCurrentPos++;

    //             // since there is only 1 char and thus no chance of multiple ifs being triggered
    //             // we can use a fallthrough style of ifs and skip the if-else tree
    //             if (prevChar == `~` && char == `~` && openSingleLineComment == false && openMultiLineComment == false) {
    //                 openSingleLineComment = true;
    //                 fileCommentStartPos = fileCurrentPos;
    //                 lineCommentStartPos = lineCurrentPos;
    //                 console.log("Single line comment STARTED on line", lineNum);
    //             }
    //             if ((char == `\n` || char == null) && openSingleLineComment == true) {
    //                 openSingleLineComment = false;
    //                 console.log("Single line comment CLOSED on line", lineNum);
    //             }
    //             if (prevChar == `~` && char == `/` && openSingleLineComment == false && openMultiLineComment == false) {
    //                 openMultiLineComment = true;
    //                 fileCommentStartPos = fileCurrentPos;
    //                 lineCommentStartPos = lineCurrentPos;
    //                 console.log("Multi line comment STARTED on line", lineNum);
    //             }
    //             if (prevChar == `/` && char == `~` && openMultiLineComment == true) {
    //                 openMultiLineComment = false;
    //                 console.log("Multi line comment CLOSED on line", lineNum);
    //             }

    //             // Whitespace Rule. If previous char is not a whitespace, add existing chunk as a token. else skip
    //             if (![`\n`, ` `, `\t`, `\r`].includes(prevChar) && char == ` ` && openSingleLineComment == false && openMultiLineComment == false) {
    //                 console.log("Whitespace found. Skipping contiguous ones", lineNum);

    //             }
    //             // Symbols rule. Symbols are always added as tokens
    //             if ([`+`, `-`, `*`, `/`, `:`, `=`, `{`, `}`, `(`, `)`].includes(char) && openSingleLineComment == false && openMultiLineComment == false) {
    //                 console.log("Symbol found. Adding to list of tokens", lineNum);
    //                 chunk = [char];
    //                 tokensList.push({
    //                     val: chunk,
    //                     line: lineNum,
    //                     filePos: fileCurrentPos,
    //                     linePos: lineCurrentPos
    //                 });
    //                 // console.log(tokensList)
    //             }
    //             if (char == `\n` && openSingleLineComment == false && openMultiLineComment == false) {
    //                 console.log("New Line found. Adding to list of tokens", lineNum);
    //             }

    //             prevChar = char;

    //         } while ((char = stream.read(1)) != null);
    //         // console.log(tokensList);


    //     });

    //     let x = stream.on('end', () => {
    //         callback(tokensList)
    //     })

    //     console.log("Lines read: ", lineNum)
    //     console.log("Chars read: ", fileCurrentPos)
    //     // console.log(tokensList)
    //     // console.log(x)

    //     return tokensList;
    // }



            // if (openSingleLineComment == false && openMultiLineComment == false) {

            // } else if (openSingleLineComment == true && openMultiLineComment == false) {

            // } else if (openSingleLineComment == false && openMultiLineComment == true) {

            // }
            // switch (char) {
            //     case `~`:
            //         switch (openComment) {
            //             case `singleLine`:
            //                 if (chunk.length == 0){

            //                 } else if (chunk[chunk.length - 1] == `\n`) {

            //                 } else if (chunk[chunk.length - 1] == `/`) {

            //                 }
            //                 break;
            //             case `multiLine`:
            //                 break;
            //             default:
            //                 break;
            //         }
            //         break;
            //     case `/`:
            //         break;
            //     case '\n':
            //         break;
            //     case ' ':
            //         break;
            //     default:
            //         break;


            // }

        // }


    //     stream.on('readable', function () {

    //         while ((char = stream.read(1)) != null) {

    //             // console.log(char)

    //             // store the char position
    //             fileCurrentPos++;

    //             //  add to the line text
    //             lineTxt.push(char);

    //             // Store the position of the char in the current line
    //             if (lineTxt.length == 0) {
    //                 lineCurrentPos++;
    //             }

    //             if (openComment == `singleLine`) {

    //                 switch (char) {
    //                     case `\n`:
    //                         openComment = null
    //                         fileCommentStartPos = null;
    //                         lineCommentStartPos = null;
    //                         console.log("Single line comment CLOSED on line", lineNum)
    //                         break;
    //                     case null:
    //                         console.log("ERROR: Single line comment is open at line", fileCommentStartPos)
    //                         break;
    //                 }

    //                 //             // There is an open multi line comment
    //             } else if (openComment == `multiLine`) {

    //                 switch (char) {
    //                     case `~`:
    //                         if (chunk[chunk.length - 1] == `/`) {
    //                             openComment = null
    //                             fileCommentStartPos = null;
    //                             lineCommentStartPos = null;
    //                             console.log("Multi line comment CLOSED on line", lineNum)
    //                         }
    //                         break;
    //                     case null:
    //                         console.log("ERROR: Single line comment is open at line", fileCommentStartPos)
    //                         break;
    //                 }

    //                 //             // The comment isn't open and this is the normal read mode
    //             } else {
    //                 switch (char) {
    //                     case `~`:
    //                         // chunk start check. skip if chunk hasn't started
    //                         if (chunk.length != 0) {
    //                             if (chunk[chunk.length - 1] == `~`) {
    //                                 openComment = "singleLine"
    //                                 fileCommentStartPos = fileCurrentPos;
    //                                 lineCommentStartPos = lineCurrentPos;
    //                                 console.log("Single line comment STARTED on line", lineNum)
    //                             }
    //                         }

    //                         chunk.push(char);
    //                         break;
    //                     case `/`:
    //                         // chunk start check. skip if chunk hasn't started
    //                         if (chunk.length != 0 && chunk[chunk.length - 1] == `~`) {
    //                             openComment = "multiLine"
    //                             fileCommentStartPos = fileCurrentPos;
    //                             lineCommentStartPos = lineCurrentPos;
    //                             console.log("Multi line comment STARTED on line", lineNum)
    //                         }
    //                         // if / is not for the multi line comment, treat it as an operator
    //                         else {
    //                             //  if a chunk already exists, commit it
    //                             addToken();

    //                             // not commit this character as a token
    //                             chunk = [char]
    //                             addToken();
    //                         }
    //                         break;
    //                     //                     case `\n`, ` `, `+`, `-`, `*`, `:`, `=`, `{`, `}`, `(`, `)`, `,`:
    //                     //                         //  if a chunk already exists, commit it
    //                     //                         addToken();

    //                     //                         // not commit this character as a token
    //                     //                         chunk = [char]
    //                     //                         addToken();
    //                     //                         break;
    //                     //                     case null:
    //                     //                         console.log("---------- END ----------")
    //                     //                         break;
    //                     //                     default:
    //                     //                         chunk.push(char);
    //                 }
    //                 //             default:
    //                 //                 console.log("weird shit comment detected")
    //                 //         }

    //                 //         // Irrespective of comment state, these are always checked

    //             }
    //             if (char == `\n`) {
    //                 lineNum++;
    //                 lineTxt = []
    //                 chunk = []
    //             }
    //             //         // Break loop when end of file is reached

    //         }
    //     });
