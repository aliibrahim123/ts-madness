import type { add8 } from "./arith.ts";
import type { asNB, Byte, Dg, Nb } from "./format.ts";
import type { and as andTable, or as orTable, xor as xorTable } from "./tables.ts";

type notTable = {
	0: 15, 1: 14, 2: 13, 3: 12, 4: 11, 5: 10, 6: 9, 7: 8, 8: 7, 9: 6, 10: 5, 11: 4, 12: 3, 13: 2, 14: 1, 15: 0
};
export type not <a extends Nb> = asNB<{ [k in Dg]: notTable[a[k]] }>
export type not8 <a extends Byte> = [notTable[a[0]], notTable[a[1]]]

export type and <a extends Nb, b extends Nb> = 
	asNB<{ [k in Dg]: andTable[a[k]][b[k]] }>;

export type or <a extends Nb, b extends Nb> = 
	asNB<{ [k in Dg]: orTable[a[k]][b[k]] }>;

export type xor <a extends Nb, b extends Nb> = 
	asNB<{ [k in Dg]: xorTable[a[k]][b[k]] }>;

export type bitClear <a extends Nb, b extends Nb> = and<a, not<b>>;
export type nand <a extends Nb, b extends Nb> = not<and<a, b>>;
export type nor <a extends Nb, b extends Nb> = not<or<a, b>>;
export type xnor <a extends Nb, b extends Nb> = not<xor<a, b>>;

type onesInDg = {
	0: [0, 0], 1: [1, 0], 2:  [1, 0], 3:  [2, 0], 4:  [1, 0], 5:  [2, 0], 6:  [2, 0], 7:  [3, 0], 
	8: [1, 0], 9: [2, 0], 10: [2, 0], 11: [3, 0], 12: [2, 0], 13: [3, 0], 14: [3, 0], 15: [4, 0]
} 
export type countBits <nb extends Nb> = add8<
	add8<
		add8<add8<onesInDg[nb[0 ]], onesInDg[nb[1 ]]>, add8<onesInDg[nb[2 ]], onesInDg[nb[3 ]]>>,
		add8<add8<onesInDg[nb[4 ]], onesInDg[nb[5 ]]>, add8<onesInDg[nb[6 ]], onesInDg[nb[7 ]]>>
	>, add8<
		add8<add8<onesInDg[nb[8 ]], onesInDg[nb[9 ]]>, add8<onesInDg[nb[10]], onesInDg[nb[11]]>>,
		add8<add8<onesInDg[nb[12]], onesInDg[nb[13]]>, add8<onesInDg[nb[14]], onesInDg[nb[15]]>>
	>
>;
export type countZeros <nb extends Nb> = countBits<not<nb>>

type ctzDg = {
	0: 4, 1: 0, 2: 1, 3: 0, 4: 2, 5: 0, 6: 1, 7: 0, 8: 3, 9: 0, 10: 1, 11: 0, 12: 2, 13: 0, 14: 1, 15: 0
}
type ctzOp <nb extends Dg[], acc extends Byte> = 
	nb extends [infer dg extends Dg, ...infer rest extends Dg[]] ? 
		dg extends 0 ? ctzOp<rest, add8<acc, [4, 0]>> : add8<acc, [ctzDg[dg], 0]> :
	[0, 4];
export type ctz <nb extends Nb> = ctzOp<nb, [0, 0]>;

type clzDg = {
	0: 4, 1: 3, 2: 2, 3: 2, 4: 1, 5: 1, 6: 1, 7: 1, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0
}
type clzOp <nb extends Dg[], acc extends Byte> = 
	nb extends [...infer rest extends Dg[], infer dg extends Dg] ? 
		dg extends 0 ? clzOp<rest, add8<acc, [4, 0]>> : add8<acc, [clzDg[dg], 0]> :
	[0, 4];
export type clz <nb extends Nb> = clzOp<nb, [0, 0]>;

export type cto <nb extends Nb> = ctz<not<nb>>;
export type clo <nb extends Nb> = clz<not<nb>>;

type revDg = {
	0: 0, 1: 8, 2: 4, 3: 12, 4: 2, 5: 10, 6: 6, 7: 14, 8: 1, 9: 9, 10: 5, 11: 13, 12: 3, 13: 11, 14: 7, 15: 15
};
export type rev <nb extends Nb> = 
	{[ K in Dg ]: revDg[nb[K]]} extends infer nb extends Record<Dg, Dg> ? [
		nb[15], nb[14], nb[13], nb[12], nb[11], nb[10], nb[9], nb[8],
		nb[7 ], nb[6 ], nb[5 ], nb[4 ], nb[3 ], nb[2 ], nb[1], nb[0]
	] : 
never;

export type rev8 <nb extends Nb> = [
	nb[14], nb[15], nb[12], nb[13], nb[10], nb[11], nb[8], nb[9],
	nb[6 ], nb[7 ], nb[4 ], nb[5 ], nb[2 ], nb[3 ], nb[0], nb[1]
];
export type rev16 <nb extends Nb> = [
	nb[12], nb[13], nb[14], nb[15], nb[8], nb[9], nb[10], nb[11],
	nb[4 ], nb[5 ], nb[6 ], nb[7 ], nb[0], nb[1], nb[2], nb[3]
];
export type rev32 <nb extends Nb> = [
	nb[8], nb[9], nb[10], nb[11], nb[12], nb[13], nb[14], nb[15],
	nb[0], nb[1], nb[2 ], nb[3 ], nb[4 ], nb[5 ], nb[6 ], nb[7 ]
];