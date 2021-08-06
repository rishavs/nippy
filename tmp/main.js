"use strict";

const fs = require('fs');
const Parser = require('./parser.js');


// const keywords = JSON.parse(fs.readFileSync('./keywords.json'));
// console.log(keywords)

let CompileError;

let tokens = Parser.tokenize('../tests/adder.nip')
console.log(tokens)
