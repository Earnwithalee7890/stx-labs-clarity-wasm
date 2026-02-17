import moo from 'moo';

const lexer = moo.compile({
    ws: { match: /\s+/, lineBreaks: true },
    lparen: '(',
    rparen: ')',
    int: /0|[1-9][0-9]*/,
    string: /"(?:\\["\\]|[^\n"\\])*"/,
    atom: /[a-zA-Z+\-*/_][a-zA-Z0-9+\-*/_?]*/,
});

import * as fs from 'fs';
import * as path from 'path';

// ... lexer definition (keep same) ...

const source = fs.readFileSync('tests/simple_arithmetic.clar', 'utf-8');
lexer.reset(source);

try {
    while (true) {
        const token = lexer.next();
        if (!token) break;
        console.log('Token:', token.type, JSON.stringify(token.value));
    }
} catch (e) {
    console.error(e);
}
