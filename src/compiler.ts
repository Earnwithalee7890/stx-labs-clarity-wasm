import type { Expression, List, Atom, Int, StringLiteral } from './types.js';
import binaryen from 'binaryen';

export function compile(ast: Expression[]): Uint8Array {
    const module = new binaryen.Module();

    // Create a main function that returns the result of the last expression
    // For now, valid Clarity programs are just a sequence of expressions.
    // We'll wrap them in a main function for execution.

    if (ast.length === 0) {
        return module.emitBinary();
    }

    // We need to compile each expression.
    // The last one is the return value.
    // In a real compiler, we'd handle scoping, but here we just process the top-level list.

    const body: number[] = [];

    for (const expr of ast) {
        body.push(compileExpression(module, expr));
    }

    // Create 'main' function: () -> i64 (using i64 for basic int support for now)
    // Logic: block of expressions, return the last one type.
    // Assuming all return i64 for this MVP step.

    const block = module.block(null, body, binaryen.i64);

    module.addFunction('main', binaryen.createType([]), binaryen.i64, [], block);
    module.addFunctionExport('main', 'main');

    // Optimize and validate
    module.optimize();

    if (!module.validate()) {
        throw new Error("Module validation failed");
    }

    return module.emitBinary();
}

function compileExpression(module: binaryen.Module, expr: Expression): number {
    if (expr.type === 'int') {
        // Map BigInt to i64
        // TODO: Handle 128-bit integers later (Clarity standard), using i64 for MVP compatibility
        return module.i64.const(Number((expr as Int).value), 0);
    }

    if (expr.type === 'list') {
        return compileList(module, (expr as List));
    }

    throw new Error(`Unsupported expression type: ${expr.type}`);
}

function compileList(module: binaryen.Module, list: List): number {
    if (list.values.length === 0) {
        throw new Error("Empty list expression");
    }

    const first = list.values[0];
    if (first?.type === 'atom') {
        const op = (first as Atom).value;
        const args = list.values.slice(1);

        if (op === '+') {
            return compileBinaryOp(module, binaryen.AddInt64, args);
        } else if (op === '-') {
            return compileBinaryOp(module, binaryen.SubInt64, args);
        } else if (op === '*') {
            return compileBinaryOp(module, binaryen.MulInt64, args);
        } else if (op === '/') {
            return compileBinaryOp(module, binaryen.DivSInt64, args);
        }

        throw new Error(`Unknown function or operator: ${op}`);
    }

    throw new Error("List must start with an atom (function call)");
}

function compileBinaryOp(module: binaryen.Module, opCode: number, args: Expression[]): number {
    if (args.length < 2) {
        throw new Error("Binary operation requires at least 2 arguments");
    }

    // Clarity allows (+ 1 2 3), which is (+ (+ 1 2) 3)
    // We treat it as a fold.

    let result = compileExpression(module, args[0]!);

    for (let i = 1; i < args.length; i++) {
        const next = compileExpression(module, args[i]!);
        if (opCode === binaryen.AddInt64) result = module.i64.add(result, next);
        else if (opCode === binaryen.SubInt64) result = module.i64.sub(result, next);
        else if (opCode === binaryen.MulInt64) result = module.i64.mul(result, next);
        else if (opCode === binaryen.DivSInt64) result = module.i64.div_s(result, next);
    }

    return result;
}
