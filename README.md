# nippy

nippy is a small, fast and easy programming language, meant for application development, currently under design. It will be a compiled language with garbage collection. Actual development will start once I have got a good idea of the language syntax, semantics and feature.

A sample nippy program is;

module MyMaths

-- This program implements a couple of simple functions and then allows any other

module to call them --

adder: of [a,b]   << 		-- "of" keyword is used to give names/aliases to program structures --

​	return a + b

end

multer: of [a,b] << a * b		-- similar function but done in a single line --



module.exports = adder, multer

------------

module MyCode

x << 10

y << 20

say MyMaths:adder(x,y) 



------

## Core Philosophy:

1. Easy: Nippy must be easy to learn and use, above anything else. 
2. Small: Nippy will have a small syntax and only a small feature set.
3. Elegant: The language will always try to be elegant and expressive whenever possible.
4. Batteries Included: Nippy places more importance on the community and ecosystem than on language semantics.

While being fast, having low memory overhead, small binaries and other attributes are also very important, nippy will always try adhere closely to its core philosophy.

**What Nippy isn't:**

It isn't an all purpose low level programming language. Nippy doesn't aims to be another C/C++

Please keep in mind that we are in the design phase itself. so there is nothing much to see right now. I am writig this document only to put down the ideas that I have on paper. The various phases that I expect the language to go through are:

- [ ] Design -- we are currently here --
- [ ] Development with LLVM as backend
- [ ] Working language
- [ ] Turing complete
- [ ] Self Host compiler

- [ ] Package Manager

- [ ] Basic 2d game engine based on Love2d

- [ ] Micro web framework
- [ ] UI

------

## Language Features

Some basic language features that I expect nippy to have, are:

- Use of indentation for code blocks. For this we look at languages like lua, ruby and python for inspiration.
- Fully Garbage collected. User should be able to specify the kind of GC they want
- Pattern Matching

some Functional Lang traits. More stuff will go here as I work on the design.

## Running nippy

A nippy code file is in the form of a `.nip` file.

To run a single file, you can simply do

`$ nippy run <file path>`

for example;

`$ nippy run MyScript.nip`

This will create a debug binary in that very folder and then run it.

## Nippy Toolset

nippy is a language which comes with its own toolset and package manager. 

nippy code can be run as simple single files or as entire projects. For any serious development, you will want to get working on a project. However, you can still use your own project structure and simply run it using the `nippy run` command.

#### New nippy project

A new nippy project can be created using the following command:

`nippy create MyApp`

This will create a project structure like this;

```
ProjectFolder
	├── bin/
	│   ├── dev/
	│   ├── prod/
	│   └── <Any other env>/
	├── deps/
	│   ├── <some nippy package>/
	│   └── <some nippy package>/
	├── docs/
	├── libs/
	│	└── <some object or binary lib>/
	├── src/
	│   ├── app/
	│   └── main.nip
	├── tests/
	├── tools/
	├── docs/
	├── .gitignore
	├── README.md
	└── LICENSE.md

```



#### Build project

To build a project, use;

`nippy build <env>`

Here, if you don't give an `env` identifier, nippy will assume it to be a dev build.

This will create the binaries and place them at `bin/<env>`

#### Run Project

This will likely be the command you use most often. This will compile the project into `bin/<env>` and then run the compiled binary. To use it, type:

`nippy run <env>`

Here, if you don't give an `env` identifier, nippy will assume it to be a dev build.

#### Install Dependencies

Dependencies can be installed with 

`nippy get deps`

If you want to get a specific package then do;

`nippy get AwesomePackage@1.2.3`

The version is optional. Multiple package can be comma separated.

## Main file

nippy project code will always start at the 

## Some Code snippets

1. ### Comments

nippy treats anything between two `--` double dashes to be a comment.

so this is a comment;

```
~ anything that goes here will be skipped by the compiler for this line
```





```
~/ This is a multiline comment.

continues on the other line.

Because why the heck not. /~
```



1. ### Modules

nippy uses modules as a way of structuring projects and namespacing.



1. ### Hello World

The good old Hello world program. Where will we be without it?!

nippy uses the "say" function. it works like "print" commands in other languages.

Case statement





nippy doesnt have if-elseif-else conditionals. Instead, we use Case to check for truthiness.

case (x == y) ?

​	== true; say: "x equals y"

​	== false -> 

​		say: "x equals y"

​	end

​	== else -> say: "This will never run, so may not use * when checking for truthiness"







end

Assignment

nippy doesn't uses `=` for assignment, as is the case in many languages. instead nippy uses `<<` or `>>` symbols for assignments.

x << 10



Chaining functions

y << add_two: << find_2_primes: << x

x >> find2primes: >> add_two >> y



rgb of [RED, BLUE, GREEN] 