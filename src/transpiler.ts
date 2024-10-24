import { walk } from "./ast";
import { genCode } from "./codegen";
import { CodegenContext, LexingContext, ParsingContext } from "./defs";
import { TranspilingError } from "./errors";
import { lexFile } from "./lexer";
import { parseFile } from "./parser";
import { ASTPrinter } from "./walkers/printer";
import { Symbolizer } from "./walkers/symbolizer";

export const transpileFile = async (filepath:string, src: string) => {
    // On any error in a stage, recover and document all errors for that stage
    // All future stages should be skipped
    let transpilingResult = false;
    let errors: TranspilingError[] = [];

    // --------------------------------------
    // Lexing
    // --------------------------------------
    let lexingStart = Date.now();
    let l = new LexingContext(filepath, src);
    lexFile(l, errors);

    if (errors.length > 0) {
        console.log(`Lexing Failed. ${errors.length} errors found.`);
        for (let error of errors) {
            console.error(error);
        }
        return false;
    }

    let lexingDuration = Date.now() - lexingStart;
    console.log(`Lexing Done: ${lexingDuration}ms ---------------`);
    for (let token of l.tokens) {
        console.log(JSON.stringify(token));
    }

    // --------------------------------------
    // Parsing
    // --------------------------------------
    let p = new ParsingContext(filepath, l.tokens);
    let parsingStart = Date.now();
    parseFile(p, errors);
    let parsingEnd = Date.now()
    let parsingDuration = parsingEnd - parsingStart;

    if (errors.length > 0) {
        console.log(`Parsing Failed. ${errors.length} errors found.`);
        for (let error of errors) {
            console.error(error);
        }
        return false;
    }

    console.log(`------------- Parsing : ${parsingDuration}ms ---------------`);
    // console.log(JSON.stringify(p.program, null, 2));

    // --------------------------------------
    // Build symbols
    // -------------------------------------- 
    let symbolsBuilder = new Symbolizer();
    // p.program.accept(symbolsBuilder);
    walk(p.program, filepath, errors, symbolsBuilder);
    if (errors.length > 0) {
        console.log(`Building Symbols Failed. ${errors.length} errors found.`);
        for (let error of errors) {
            console.error(error);
        }
        return false;
    }

    // --------------------------------------
    // Analyze
    // -------------------------------------- 





    // --------------------------------------
    // PrinT AST
    // -------------------------------------- 
    console.log(`------- Printing AST : -------------`);
    let astprinter = new ASTPrinter();
    walk(p.program, filepath, errors, astprinter);
    // p.program.accept(astprinter);
    // console.log("Nodes visited", astprinter.nodesVisited);

    // p.program.accept(printAST);
    

    // --------------------------------------
    // code generation
    // --------------------------------------    
    let g = new CodegenContext(filepath, p.program);
    genCode(g);
    let codegenDuration = Date.now() - parsingEnd
    console.log(`------- Generating Code : ${codegenDuration}ms -------------`);
    console.log(g.cFileCode)
    // Any failure in codegen is fatal

    // // alternate codegen using visitor
    // console.log(`------- Generating Code using visitor : -------------`);
    // let codeGenerator = new CodeGenerator();
    // p.program.accept(codeGenerator);
    // console.log(codeGenerator.code);

    return transpilingResult;
}
