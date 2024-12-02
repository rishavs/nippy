// import { expect, test, describe } from "bun:test";

// describe('Basic Misc', () => {
//     test('Null input', () => {
//         let input = "";
//         let expected = 
// /*c99*/`#include <stdlib.h>

// int main() {

//     return 0;
// }`;
//         let ctx = new Context('', input)
//         lexFile(ctx)
//         parseFile(ctx)

//         // Check if there are any errors
//         expect(ctx.errors.length).toBe(0);

//         let actual = genC99MainSource(ctx.root)
//         expect(expected).toBe(actual);
//     })

//     test('Whitespace with comments', () => {
//         let input = ` 
            
//         -- single line comment
//         -[multiline comment]-`;
//         let expected = /*c99*/`int main() {

//     return 0;
// }`;
//         let ctx = new Context('', input)
//         lexFile(ctx)
//         parseFile(ctx)

//         // Check if there are any errors
//         expect(ctx.errors.length).toBe(0);

//         let actual = genC99MainSource(ctx.root)
//         expect(expected).toBe(actual);
//     })

//     test('Multiple expressions with comments', () => {
//         let input = `let x = 10 + 1 -- comment
//         let y = 20 + -[This is a
//         multi line comment]-2
//         print(x + y)`;
//         let expected = /*c99*/`int main() {
//     int x = 10 + 1;
//     int y = 20 + 2;
//     print(x + y);
//     return 0;
// }`;
//         let ctx = new Context('', input)
//         lexFile(ctx)
//         parseFile(ctx)

//         // Check if there are any errors
//         expect(ctx.errors.length).toBe(0);

//         let actual = genC99MainSource(ctx.root)
//         expect(expected).toBe(actual);
//     })
// })