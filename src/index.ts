import * as fs from 'fs';
import * as path from 'path';
import { parse } from './parser.js';
import { compile } from './compiler.js';

async function main() {
    const args = process.argv.slice(2);
    if (args.length < 1) {
        console.error('Usage: ts-node src/index.ts <input.clar> [output.wasm]');
        process.exit(1);
    }

    const inputFile = args[0];

    if (!inputFile) {
        console.error('Usage: ts-node src/index.ts <input.clar> [output.wasm]');
        process.exit(1);
    }

    const outputFile = args[1] || inputFile.replace(/\.clar$/, '.wasm');

    if (!fs.existsSync(inputFile)) {
        console.error(`Error: Input file '${inputFile}' not found.`);
        process.exit(1);
    }

    const source = fs.readFileSync(inputFile, 'utf-8');
    console.log(`Compiling ${inputFile}...`);

    try {
        const ast = parse(source);
        console.log('Parsed AST:', JSON.stringify(ast, (key, value) =>
            typeof value === 'bigint' ? value.toString() + 'n' : value
            , 2));

        const wasm = compile(ast);
        fs.writeFileSync(outputFile, wasm);
        console.log(`Output written to ${outputFile}`);
    } catch (err) {
        console.error('Compilation failed:', err);
        process.exit(1);
    }
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
