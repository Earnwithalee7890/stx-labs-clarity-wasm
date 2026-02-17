export type Atom = { type: 'atom', value: string };
export type Int = { type: 'int', value: bigint };
export type StringLiteral = { type: 'string', value: string };

export type Expression = Atom | Int | List | StringLiteral;

export type List = { type: 'list', values: Expression[] };

