import { RootNode, walk } from "./ast";
import { genCode } from "./codegen";
import { CodegenContext, LexingContext, ParsingContext } from "./defs";
import { lexFile } from "./lexer";
import { parseFile } from "./parser";

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
    let parsingDuration = Date.now() - parsingStart;

    if (p.errors.length > 0) {
        console.log(`Parsing Failed. ${p.errors.length} errors found.`);
        for (let error of p.errors) {
            console.error(error);
        }
        return false;
    }

    console.log(`------------- Parsing : ${parsingDuration}ms ---------------`);
    // console.log(JSON.stringify(p.program, null, 2));

    // print using walker
    walk(p.program, 0, (node: any, depth: number) => {
        let indent = "  ".repeat(depth); // Use depth for indentation
        let keyValPairs = Object.entries(node).map(([key, val]) => {
            if (["at", "line", "isMutable", "isNewDeclaration"].includes(key)) {
                return `${key}: ${val}`;
            }
        }).filter(Boolean);

        console.log(`${indent}${node.kind} ${node.value || ""} { ${keyValPairs.join(", ")} }`);
    });

    // --------------------------------------
    // code generation
    // --------------------------------------    
    let g = new CodegenContext(filepath, p.program);
    genCode(g);
    console.log(g.cFileCode)
    // Any failure in codegen is fatal

    return transpilingResult;
}
