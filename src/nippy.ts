import { transpileFile } from "./transpiler";

let args = Bun.argv.slice(2);
if (args.length === 0) {
    console.log("Seawitch Programming Language");
    console.log("Version: 0.0.1");
    console.log("Usage: seawitch [options] <file>");
    console.log("Options:");
    console.log("  -h, --help\t\tPrint this help message");
    console.log("  -v, --version\t\tPrint version information");
} else if (args.length === 2 && args[0] === "run") {   
    let filepath = args[1];
    // check if file exists
    const file = Bun.file(filepath);
    // Check if file is a seawitch file *.sea
    if (!filepath.endsWith(".sea")) {
        console.log("Error: Invalid file type. Seawitch files must have a .sea extension");
        process.exit(1);
    }
    if (! await file.exists()) {
        console.log(`Error: Given Source File "${filepath}" not found`);
        process.exit(1);
    }

    console.log("Compiling file: " + filepath);
    
    // Transpile file
    let res = await transpileFile(filepath, await file.text());
    process.exit(res ? 0 : 1);

    // Compile file
    // Execute file

} else {
    console.log("Invalid arguments");
}
