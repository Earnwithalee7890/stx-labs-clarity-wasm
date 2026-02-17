import type { Expression, List } from './types';
import moo from 'moo';

const lexer = moo.compile({
    ws: { match: /\s+/, lineBreaks: true },
    lparen: '(',
    rparen: ')',
    int: /0|[1-9][0-9]*/,
    string: /"(?:\\["\\]|[^\n"\\])*"/,
    atom: /[a-zA-Z+\-*/_][a-zA-Z0-9+\-*/_?]*/,
});

export function parse(source: string): Expression[] {
    lexer.reset(source);

    const expressions: Expression[] = [];

    while (true) {
        const token = lexer.next();
        if (!token) break;

        if (token.type === 'ws') continue;

        if (token.type === 'lparen') {
            expressions.push(parseList());
        } else if (token.type === 'int') {
            expressions.push({ type: 'int', value: BigInt(token.value) });
        } else if (token.type === 'string') {
            expressions.push({ type: 'string', value: token.value.slice(1, -1) });
        } else if (token.type === 'atom') {
            expressions.push({ type: 'atom', value: token.value });
        } else {
            throw new Error(`Unexpected token: ${token.type} value: ${token.value}`);
        }
    }

    return expressions;
}

function parseList(): List {
    const values: Expression[] = [];

    while (true) {
        const token = lexer.next();
        if (!token) {
            throw new Error('Unexpected end of input inside list');
        }

        if (token.type === 'ws') continue;

        if (token.type === 'rparen') {
            return { type: 'list', values };
        } else if (token.type === 'lparen') {
            values.push(parseList());
        } else if (token.type === 'int') {
            values.push({ type: 'int', value: BigInt(token.value) });
        } else if (token.type === 'string') {
            values.push({ type: 'string', value: token.value.slice(1, -1) });
        } else if (token.type === 'atom') {
            values.push({ type: 'atom', value: token.value });
        } else {
            throw new Error(`Unexpected token inside list: ${token.type} value: ${token.value}`);
        }
    }
}
