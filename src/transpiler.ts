import { ASTNode, BlockNode, DeclarationNode, FloatNode, IdentifierNode, IntNode, RootNode, Visitor, walk } from "./ast";
import { genCode } from "./codegen";
import { CodegenContext, LexingContext, ParsingContext } from "./defs";
import { lexFile } from "./lexer";
import { parseFile } from "./parser";
import { ASTPrinter } from "./walkers/printer";

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

    // --------------------------------------
    // Parsing
    // --------------------------------------
    let p = new ParsingContext(filepath, l.tokens);
    let parsingStart = Date.now();
    parseFile(p);
    let parsingEnd = Date.now()
    let parsingDuration = parsingEnd - parsingStart;

    if (p.errors.length > 0) {
        console.log(`Parsing Failed. ${p.errors.length} errors found.`);
        for (let error of p.errors) {
            console.error(error);
        }
        return false;
    }

    console.log(`------------- Parsing : ${parsingDuration}ms ---------------`);
    // console.log(JSON.stringify(p.program, null, 2));

    // --------------------------------------
    // Build symbols
    // -------------------------------------- 
    walk (p.program, 0, (node: any, depth: number) => {
        if (node instanceof BlockNode) {
            for (let statement of node.statements) {
                if (statement instanceof DeclarationNode) {
                    node.symbols[statement.identifier.value] = statement.isNewDeclaration ? "int" : "float";
                } else {
                    throw new Error(`Unhandled Statement Node: ${statement.constructor.name}`);
                }
            }
        }
    });


    // --------------------------------------
    // Analyze
    // -------------------------------------- 





    // --------------------------------------
    // PrinT AST
    // -------------------------------------- 
    console.log(`------- Printing AST : -------------`);
    let astprinter = new ASTPrinter();
    p.program.accept(astprinter);
    console.log("Nodes visited", astprinter.nodesVisited);

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

    return transpilingResult;
}
