Add a Leave method to visitor. in ast nodes, every time the node is done, call leave.

Pass a single errors list to all stages, including the visitors
Move to the visitor pattern and redo the codegen using this

Fix issue with block returning array, while rest of code expects a single error object. Issues with block statements like loops.

// Add parentScope to block node. Add currentScope to context for easy parenting. Use this to copy parent symbols to current symbols

// rebuild symbols and add the parent block's symbols to current block's symbols

[] variable has already been declared and cannot be redeclared
[] variable has not been declred and cannot be assigned
[] variable is defined as const and cannot be reassigned

Create negative test cases for all compiler checks and errors

[] CLosures - iterate over parent's symbols table and then own table. where a symbol is created, only go up to that level

Scope:
    - no closures for functions within functions
    - automatic context passing / closure for embedded blocks like if-else, for loop etc. This is because these blocks always live within their parent and expire when the parent scope is finished.


<!-- let ifExample : Int = if 1 == 1 with(n: number) then n+1 1 else 2 end -->


<!-- 
if (y: number) -> number =>
    ? x == 2    then y += 2 end
    ? x == 3    then y += 3 end
    ? else      then y += 1 end
end
if (x: number) -> number =>
    is 2    then y += 2 end
    is 3    then y += 3 end
    else then y += 1 end
end

let f = fn (x: int, y: int) -> int =>
    return x + y
end

loop (y: number) do


end 

let p = if (x: number) -> number =>
    |- x == 2 -> results y + 2 
    ...
    |- x == 3 ->
    ...
else
    ...
end

let q = if 
| x == 2 ? 2 
| x == 3 ? 3 
| else 4 
end

-->




The Crystal language's compiler performs a variety of checks to ensure that the code is correct, safe, and efficient. Here's an exhaustive list of checks that the Crystal compiler typically performs:
1. Syntax Checks

    Ensures that the program conforms to Crystal's grammar and syntax.
    Detects malformed expressions, missing tokens (like parentheses, commas, etc.), and incorrect keywords.

2. Type Inference and Checking

    Crystal uses static types and infers types when possible. The compiler checks:
        That types are correct and consistent throughout the program.
        Inferred types are compatible with explicitly declared types (if any).
        Ensures that variable types do not change after initialization.
    This includes checking that method return types match the declared return types.

3. Nil Safety

    Crystal enforces nil safety, meaning variables can’t be nil unless explicitly marked. The compiler checks:
        Nilable types (like Int32?) are only used where nil is expected.
        Non-nilable variables (like Int32) can’t be assigned or return nil.
        Appropriate checks and handling for nil values (using if, try, &., etc.).

4. Method Existence and Overloads

    Ensures that called methods actually exist for the type of the object.
    If a method is overloaded, the compiler checks that the correct overload is selected based on the argument types.
    Checks for ambiguous or conflicting method overloads.

5. Return Type Consistency

    Ensures that a method’s return type is consistent with the declared or inferred type.
    If a method may return multiple types (using union types), the compiler ensures all possible return types are accounted for.

6. Type Restrictions on Generics

    Crystal supports generic types with type restrictions (e.g., T : Number). The compiler checks:
        Type arguments passed to generic types satisfy the specified constraints.
        Usage of generic methods adheres to the type restrictions.

7. Instance and Class Variable Initialization

    The compiler checks that instance variables (@var) and class variables (@@var) are initialized before they are used.
    Ensures that variables are not accessed before they are properly assigned a value.

8. Constant Definition and Type Stability

    Ensures that constants (declared with CONST_NAME) are defined and initialized with valid values.
    Crystal checks that constants are not reassigned or mutated in an unexpected way (although technically allowed).

9. Control Flow Analysis

    The compiler performs flow analysis to ensure that all code paths return a value where required, especially for methods that must return something.
    Detects unreachable code or dead code that can never be executed.
    Detects infinite loops, non-terminating recursive calls, and missing return statements in methods that expect to return a value.

10. Union Type Management

    Crystal supports union types (e.g., Int32 | String). The compiler ensures:
        Proper handling of union types, including ensuring that all branches of a conditional handle all possible types in the union.
        Appropriate use of type casting (with as or responds_to?) when interacting with union types.

11. Exception Handling

    Checks that methods raising exceptions are either rescued properly or marked with the ! operator, indicating that the method might raise an exception.
    Ensures that exception types are correctly handled in rescue blocks.

12. Macro Expansion and Hygiene

    Crystal’s macros allow code generation at compile-time. The compiler checks:
        Macros expand into valid Crystal code.
        Syntax and semantic correctness of the expanded code.
        Avoidance of variable name clashes (hygiene) in macros.

13. Unused Variables and Constants

    Warns about declared variables and constants that are never used in the code.
    Can flag unnecessary code that doesn’t affect the program execution.

14. Method Visibility and Access Control

    Ensures that methods respect access control modifiers:
        private: Can only be called within the defining class.
        protected: Can be called by subclasses.
        public: Accessible from anywhere.

15. Interface Conformance

    If a class includes a module or implements an interface, the compiler checks that the class implements all required methods.
    Ensures that methods match the signature required by the interface.

16. Memory Safety

    While Crystal doesn’t have a garbage collector, the compiler performs checks to avoid common memory safety issues:
        Ensures no dangling references or unsafe memory access in typical cases (although manual memory management is possible using Pointer).

17. C Bindings and FFI (Foreign Function Interface)

    If Crystal code interacts with C libraries via FFI, the compiler checks:
        That the bindings and types used in the Crystal code match the expected C types.
        Handles differences between Crystal and C memory management (especially when managing pointers).

18. Parallelism and Fiber Safety

    Crystal uses fibers for concurrency. The compiler ensures:
        Proper usage of fibers and checks for potential race conditions.
        Ensures that fibers interact safely with channels.

19. LLVM Intermediate Representation (IR) Generation

    Once all high-level checks pass, the Crystal compiler generates LLVM IR. The compiler ensures:
        The generated IR is valid and optimized for performance.
        Any potential issues related to undefined behavior or optimization are flagged during the IR generation process.

20. Compiler Warnings

    Besides strict errors, the Crystal compiler issues warnings for:
        Deprecated features or syntax.
        Possible performance bottlenecks.
        Non-idiomatic code patterns (such as unused variables, unreachable code, or ineffective loops).

21. Standard Library and External Dependencies

    When using external libraries (shards) or the Crystal standard library, the compiler checks:
        That the dependencies are correctly loaded and compatible with the Crystal version.
        That any native dependencies (like linked C libraries) are available and correctly referenced.

22. Annotations and Metadata

    Crystal allows for code annotations that can influence compile-time behavior (such as @[Link] or @[GC]). The compiler ensures:
        Annotations are valid and correctly applied.
        Checks for custom annotations that might be used in macro meta-programming.

23. Structural and Nominal Type Checking

    Crystal supports both nominal and structural type checks. For example:
        Ensures that structural typing (duck typing) is correct by checking if the necessary methods exist.
        Verifies that nominal types (class-based or interface-based typing) conform to the correct inheritance hierarchy.

24. Cross-Module and Namespace Checks

    Ensures proper resolution of symbols across different modules and namespaces.
    Verifies that no namespace collisions occur between different parts of the program or external libraries.

25. Immutable and Mutable Data Checking

    Crystal provides ways to ensure that certain objects or data structures remain immutable.
    The compiler ensures that immutable types or variables are not modified accidentally.



    ----------------------------

    The Luau compiler/interpreter performs a series of checks to ensure that the code executes correctly and efficiently. Luau is a fast, dynamic scripting language developed primarily for the Roblox platform, with a focus on type safety and performance. Here's an exhaustive list of the key checks performed by the Luau compiler and interpreter:
1. Syntax Checking

    Ensures that the code follows the correct grammar and syntax of Luau.
    Detects missing punctuation (e.g., parentheses, commas, etc.) and incorrect language constructs.

2. Type Checking (Optional, Type Inference)

    Luau supports optional static typing with type annotations. The type checker ensures:
        Variables and expressions conform to their declared types.
        Proper type assignment for inferred types without explicit annotations.
        Type annotations match function signatures, local variables, and return types.
    Ensures that all operations between types (like arithmetic or string concatenation) are valid.
    Type inference and unions are checked to ensure that the inferred types match the expected types where applicable.

3. Nil Safety

    Ensures that variables not explicitly declared as nil cannot contain nil unless they have union types with nil (e.g., T?).
    Checks that functions expecting non-nil parameters are not passed nil values.

4. Function Call Validation

    Checks that the number of arguments passed to a function matches the number of parameters.
    Ensures that the argument types conform to the function's expected parameter types.
    If functions return multiple values, ensures the correct number and types of return values are handled properly.

5. Global and Local Variable Checks

    Warns about the use of undeclared variables, promoting better scoping and avoiding accidental global usage.
    Ensures that local variables are properly initialized before use.
    Ensures that variables are not accidentally shadowed within nested scopes unless intended.

6. Control Flow Analysis

    Detects unreachable code, such as after a return, break, or continue statement.
    Analyzes whether all code paths in a function or block properly return a value if required (especially when functions have a specific return type).
    Identifies dead code or blocks of code that can never be executed.

7. Type Assertions and Casts

    Ensures that type assertions (e.g., as Type) are used correctly, casting values to the correct type.
    Ensures that type assertions are consistent with the inferred or declared types.

8. Table and Array Access

    Verifies that table access (table[key]) is done with valid key types for the table structure.
    For arrays (tables indexed with integers), ensures that the keys are within valid index ranges and that appropriate values are retrieved or assigned.
    Ensures correct type consistency for table fields with known types.

9. Metamethod and Metatable Checks

    Ensures that the appropriate metamethods (__index, __newindex, __call, etc.) are correctly defined and invoked.
    Verifies that metatables applied to tables conform to expected types, preventing invalid operations.

10. Type Guards and Assertions

    Luau supports type guards for narrowing union types. The interpreter ensures that:
        Type guards (like if x == number then ...) are properly respected.
        Code paths account for all possible types in union types, and appropriate type narrowing is applied after a check.

11. Loop Control (for, while, repeat)

    Checks the correct structure of loop constructs (for, while, repeat).
    Verifies that the loop control variables are used properly and not modified in ways that could cause infinite loops or premature terminations.
    Detects if a break statement is unreachable or misused within loops.

12. Scope and Lifetimes

    Ensures that variables have proper scope visibility and cannot be used outside their declared scope.
    Checks for accidental shadowing of variables in nested scopes, which might lead to unexpected behavior.

13. Recursive Function Calls

    Detects potential infinite recursion by analyzing recursive function calls (though runtime checks are more effective for preventing stack overflows).
    Ensures that mutually recursive functions are properly declared and conform to type expectations if statically typed.

14. Function Overloads and Multiple Returns

    Luau allows functions to return multiple values. The interpreter checks:
        That functions with multiple return values are handled correctly when used.
        If a function overload exists, ensures that the correct overload is chosen based on the argument types.

15. Operator Overloading

    If a table has metamethods like __add, __sub, etc., the interpreter ensures:
        That operators are used correctly based on the metamethods defined.
        That tables with operator metamethods are applied where expected.

16. Garbage Collection and Memory Safety

    Ensures that memory management is safe, even though garbage collection is handled automatically by the runtime.
    Prevents memory leaks by ensuring proper scoping and variable lifetimes.

17. String Operations

    Verifies that string concatenation and manipulation are performed correctly.
    Ensures that string methods are used appropriately and that the types passed to them are valid.

18. Coroutine Management

    Checks the proper creation, resumption, and yielding of coroutines.
    Ensures that coroutines follow the proper flow of execution and that values yielded or returned are of the expected types.

19. Library and API Consistency

    Luau comes with standard libraries (such as math, table, string, etc.). The interpreter ensures:
        Correct usage of the standard library functions.
        Valid arguments and return values for API calls.
    Checks consistency when interacting with Roblox-specific APIs, ensuring that calls to game services are valid and have the right types of parameters.

20. Error Handling and Pcall

    Ensures that error handling via pcall (protected call) or xpcall (extended protected call) is properly handled.
    Ensures that functions wrapped in pcall return values and errors correctly, and that error handling is correct.

21. Thread and Task Scheduling

    Ensures that multi-threading or task scheduling (via Roblox's task scheduling methods) operates as expected without deadlocks or race conditions.
    Monitors fiber and task usage in scenarios where they are involved.

22. Type Definition and Alias Validation

    Luau allows users to define custom types and aliases. The compiler ensures that:
        Defined types are consistent and properly referenced throughout the code.
        Aliases are used correctly and do not conflict with native types.

23. Module System Integrity

    If using the module system (common in Roblox development), the compiler checks that:
        Modules are loaded correctly.
        Return types from required modules conform to the expected interfaces or types.
        There are no cyclic dependencies between modules, preventing infinite loading loops.

24. Deprecated Function and Feature Warnings

    The interpreter flags the usage of deprecated functions, features, or APIs.
    Provides warnings when a feature is scheduled to be removed in future versions of Luau.

25. Optimizations and Performance Hints

    Luau includes various optimizations at runtime. The interpreter may issue performance hints or warnings regarding:
        Inefficient loops or operations.
        Redundant calculations.
        Excessive memory usage or unoptimized table usage.

26. Runtime Safety

    At runtime, Luau ensures that the following are handled safely:
        Division by zero.
        Out-of-bound array accesses.
        Invalid type casts or conversions.
        Runtime errors are caught and handled with informative error messages.

27. Concurrency and Yielding

    Ensures that yielding operations in Luau coroutines or Roblox's task model are respected and do not cause unintended interruptions.
    Monitors the execution state when interacting with asynchronous operations, especially in the Roblox environment.

