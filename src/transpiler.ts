import { LexingContext } from "./defs";
import { lexFile } from "./lexer";

export const transpileFile = async (filepath:string, src: string) => {
    // On any error in a stage, recover and document all errors for that stage
    // All future stages should be skipped
    let transpilingResult = false;
    // --------------------------------------
    // Lexing
    // --------------------------------------
    let lexingStart = Date.now();
    let l = new LexingContext(filepath, src);
    lexFile(l);

    if (l.errors.length > 0) {
        console.log(`Lexing Failed. ${l.errors.length} errors found.`);
        for (let error of l.errors) {
            console.error(error);
        }
        return false;
    }

    let lexingDuration = Date.now() - lexingStart;
    console.log(`Lexing Done: ${lexingDuration}ms ---------------`);
    for (let token of l.tokens) {
        console.log(JSON.stringify(token));
    }

    // // --------------------------------------
    // // Parsing
    // // --------------------------------------
    // let p: ParsingContext = {
    //     tokens: lexingResult as Token[],
    //     i: 0,
    // }
    // let parsingStart = Date.now();
    // let parsingResult = parse_file(p);
    // let parsingDuration = Date.now() - parsingStart;

    // console.log(`------------- Parsing : ${parsingDuration}ms ---------------`);
    // console.log(JSON.stringify(parsingResult, null, 2));

    // if (Array.isArray(parsingResult)) {
    //     console.error(parsingResult);
    //     process.exit(1);
    // }
    // let code = gen_root(parsingResult);
    // console.log(`------------- Codegen : ${Date.now() - parsingEnd}ms ---------------`);    
    // console.log("Generated: ", code);
    // await gen_c99(parsingResult)

    return transpilingResult;
}