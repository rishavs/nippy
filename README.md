# nippy

nippy is a small, fast and easy programming language, meant for application development, currently under design. It will be a statically typed, compiled language with garbage collection. The current plan is to go for a procedural approach with simple composition based OOPs.

A sample nippy program is;

```
var $a: Num|Nil
a = 10

myColors: @Red | @Blue
myColors = @Red

myAdderFunc: Fun(x: Num, y: Num): Num {
    return x + y
}
myAdderFunc: (x: Num, y: Num): Num =>
    return x + y
end

myVoidFunc: Func(x: Num, y: Num) {
    show x, y
}

myObject: Object { 
    Text, Text | Object { Text, Text }
}
myObject = {
    "id" = "dingdong"
    `foo` = `bar`,
    "left" = "right",
    `whoAmI` = {
        "name" = "Rishav",
        "profession" = "slacker",
    }
}
show myObject."whoAmI."name"

newObj = myObject.each(item, 
    Func(item, self):Text {
        return item."id"
    }
)

-- List is just a sugared Object with hidden index --
myList: List { Num | Text }
myList = [1, 3, 8, `foo`, "bar"]

myList.each with Func(item):Text {
    show item
} 

newTextList << myList.each(item, Func():Text {
    
    
})
sum: Num = 0
[1..10].each (item, Func(item, self):Text {
    sum = sum + item    
})


-- Set is just a sugared List with unique items --
mySet: Set ( x: Num | Text )
mySet = [1, 3, 8]

getLargest = mySet.reduce with Func():Num {
}

Point: Class {
    var x: Num,
    y: Num,
    distanceFromPoint: Func (p2: Point) -> Num {
        return p2.x - self.x
    }
}

-- Classes have the following event ethods; onInit, onDestruct, onInherit, onCompose --

p1 = Point(20, 30)
p1.x = 25
show p1.y
show p1.distanceFromPoint(10, 40)

-- composition --
p1.a << someVar:Num = 10

p = when x is
| 1 -> returnSometing1()
| 2 -> returnSomething2()
| _ -> returnSomething3()



a: Num = 10
myList = [1, 2, 3]
[a].append [1, 2, 3]
myList.append [4, 5]
myList.prepend [0]
```





------

## Core Philosophy

The key goals of the language, in the order of priority, are;

1. **DevEx first:** Optimize for Developer happiness
2. **Batteries Included:** Nippy places more importance on having a robust stdlib, toolchain and ecosystem than on language semantics.
3. **Easy:** Nippy must be easy to learn and use, above anything else. 
4. **Small:** Nippy will have a small syntax and only a small feature set.
5. **Fast Compilation:** The language will always try to be elegant and expressive whenever possible.
6. **One way:** There should be only one way to do things in Nippy
7. **Performant:** 80% of the peroformance of C with 20% of the headache
8. **Readability:** It should be easy to read and understand the written code at a glance

While being fast, having low memory overhead, small binaries and other attributes are also very important, nippy will always try adhere closely to its core philosophy.
Nippy aims to compile down to C99 for interop. Nippy doesn't try to blaze the frontiers of language design but instead aims to mplement the best ideas from other great languages.

#### What Nippy isn't:

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

Nippy is a good thief. It plans to steal all the best features from the best languages out there;

- Elm's Error messaging

- Crystal's/F#s type system including Nil types

- F#'s 'pipeline operator

- Lua's coroutines

- Lua's list implementation (List are sugared tables, with key = index)

- JS's explicit imports and exports

- Pyret's inline tests for functions

- Zig's errdefer and custom allocators?

Other key language features will be;

- JSON is a first class citizen

- Everything is an object

- Everything is an expression

- Pattern Matching

- Each file is a module

- Value types

- Nested/hierarchical Types

- Composition based OOPs

- Operator/Function overloading

- Generics

- Object destructuring

- x.func(y) is sugar for func(x, y)

- Functions always return?

- Pass by value?

- returning multiple values

- Primitive types : num(f64), text(list of chars), symbol, bool, stream

- Advanced Types - Vector2, Vector3, 

- Complex types - Objects

- Collection Types - Lists and Sets

- Infinity as a special Num value like 0

- Fortran like rational number type?

- single loop type alongwith iterators and map/reduce

- no if else or case statements

- 1 based indexing by default, but allow devs to change this

- state machine as a first class citizen. think a directional enum where values can only go in the defined direction

Memory Management;

- Manual to start with. see https://www.microsoft.com/en-us/research/wp-content/uploads/2017/03/kedia2017mem.pdf
  
  "Also, custom allocators, hands-down. Pair them with a defer mechanism, and they make manual memory management as easy as using a GC for most cases, and they're incredibly fast. Where a GC might take milliseconds to clean up garbage, a custom allocator can do the same work in nanoseconds. I won't say they're always better than GC because there may be some problems where you have to use heap allocations for everything, and I'd rather use a GC than trash like RAII with ARC, but for most problems custom allocators are just really nice."

- Immix/Arc later?

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

nippy package manager will install the latest version of the compiler in global. But for each project, the compiler itself is added as a dependency.

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
    │    └── <some non-nippy object or lib>/
    ├── src/
    │   ├── app/
    │   └── main.nip
    ├── tests/
    ├── tools/
    ├── docs/
    ├── .gitignore
    ├── README.md
    ├── LICENSE.md
    └── build.nip
```

`build.nip` is the project definition and contains details of the project and its dependencies.
when nippy is run in any project, it will always look for this file to parse through.

#### Build project

To build a project, use;

`nippy build <env>`

Here, if you don't give an `env` identifier, nippy will assume it to be a dev build.

This will create the binaries and place them at `bin/<env>`

`nippy init` can be used to initialize nippy in an existing project directory. This will create a default `build.nip` file in the project root.

#### Run Project

This will likely be the command you use most often. This will compile the project into `bin/<env>` and then run the compiled binary. To use it, type:

`nippy run <env?> <loglevel?>`

Here, if you don't give an `env` identifier, nippy will assume it to be a dev build.

#### Install Dependencies

Dependencies can be installed with 

`nippy get deps`

If you want to get a specific package then do;

`nippy get AwesomePackage@1.2.3`

The version is optional. Multiple package can be comma separated.

## Main file

nippy project code will always start at the 

## Language Concepts

1. ### Comments

nippy treats anything between two `--` double dashes, or `--` and `\n` to be a comment.

so this is a comment;

```
-- anything that goes here will be skipped by the compiler for this line
```

```
-- This is a multiline comment.

continues on the other line.

Because why the heck not. --
```

### Modules

nippy uses modules as a way of structuring projects and namespacing.

Every program MUST begin at a Main module

It is recommended to have only 1 module in 1 file.

### Namespaces

nippy has no global namespace at all. All namespaces are specific to a module.

### Assignment

nippy doesn't uses `=` for assignment, as is the case in many languages. instead nippy uses `<<` or `>>` symbols for assignments.

x << 10

### Basic Types

1. num
2. text
3. bool
4. vec
5. obj
6. fn
7. struct

### Range

{3 to 7 } is the same as {3, 4, 5, 6, 7} which in turn is the same as;
{1 : 3, 2: 4, 3:5, 4:6, 5:7}

### Functions

sum << fn(x,y) is                -- block style --

​    return x + y

end

sum << fn (x,y) is x+y            -- single line style --

Function Guards

A functions can have optional guards where attributes of input and output can be given. this ensures that the compiler can check them during compile time and see if there are any cases of type mismatch or such.

sum of [x,y] is                -- block style --

​    guarded by

​        x.type is Int and

​        y.type is Int and

​        result.type is Int and result > x and result > y

​        

​    defined by

​        return x + y

​    end

end

sum << fn (...) is

​    overloaded by

### Chaining functions

y << add_two: << find_2_primes: << x

x >> find2primes: >> add_two >> y

rgb of [RED, BLUE, GREEN] 

## Sample Programs

### Hello World

The good old Hello world program. Where will we be without it?!

nippy uses the "say" function. it works like "print" commands in other languages.

Case statement

nippy doesnt have if-elseif-else conditionals. Instead, we use Case to check for truthiness.

case (x == y) ?

​    == true; say: "x equals y"

​    == false -> 

​        say: "x equals y"

​    end

​    == else -> say: "This will never run, so may not use * when checking for truthiness"

end

no declaring a variable without giving it a value.

any variable can be null but it will stil have type. 

some_val.type #=> Num

some_val.value #=> None
