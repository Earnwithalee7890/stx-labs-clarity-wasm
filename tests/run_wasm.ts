import * as fs from 'fs';
import * as path from 'path';

const wasmPath = process.argv[2];

if (!wasmPath) {
    console.error("Usage: ts-node tests/run_wasm.ts <path/to/file.wasm>");
    process.exit(1);
}

const wasmBuffer = fs.readFileSync(wasmPath);

WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
    const { instance } = wasmModule;
    const main = instance.exports.main as () => bigint;

    try {
        const result = main();
        console.log(`Result: ${result}`);
    } catch (e) {
        console.error("Execution failed:", e);
    }
}).catch(e => {
    console.error("Instantiation failed:", e);
});
