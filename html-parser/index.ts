export type Node = Element | string;

export type Element = {
	tag: string;
	attrs: Record<string, string>;
	children: Node[];
};

type EmptyElement = {
	tag: 'unkown',
	attrs: {},
	children: []
};

export type parse <source extends string> = undefined;