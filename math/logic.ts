import type { add8 } from "./arith.ts";
import type { sign } from "./comp.ts";
import type { asN64, Byte, Dg, n16, n64 } from "./format.ts";
import type { and as andTable, or as orTable, xor as xorTable } from "./tables.ts";

/** nb: dg => ~nb */
type notTable = {
	0: 15, 1: 14, 2: 13, 3: 12, 4: 11, 5: 10, 6: 9, 7: 8, 8: 7, 9: 6, 10: 5, 11: 4, 12: 3, 13: 2, 14: 1, 15: 0
};
/** bitwise inverse of a nb */
export type not <a extends n64> = asN64<{ [k in Dg]: notTable[a[k]] }>
/** bitwise inverse of a byte */
export type not8 <a extends Byte> = [notTable[a[0]], notTable[a[1]]]

/** anding of two nb */
export type and <a extends n64, b extends n64> = 
	asN64<{ [k in Dg]: andTable[a[k]][b[k]] }>;

/** oring of two nb */
export type or <a extends n64, b extends n64> = 
	asN64<{ [k in Dg]: orTable[a[k]][b[k]] }>;

/** exclusive oring of two nb */
export type xor <a extends n64, b extends n64> = 
	asN64<{ [k in Dg]: xorTable[a[k]][b[k]] }>;
	
export type and16 <a extends n16, b extends n16> =
	[andTable[a[0]][b[0]], andTable[a[1]][b[1]], andTable[a[2]][b[2]], andTable[a[3]][b[3]]];
export type xor16 <a extends n16, b extends n16> =
	[xorTable[a[0]][b[0]], xorTable[a[1]][b[1]], xorTable[a[2]][b[2]], xorTable[a[3]][b[3]]];

/** inverse of anding a and b */
export type nand <a extends n64, b extends n64> = not<and<a, b>>;
/** inverse of oring a and b */
export type nor <a extends n64, b extends n64> = not<or<a, b>>;
/** inverse of exclusive oring a and b */
export type xnor <a extends n64, b extends n64> = not<xor<a, b>>;
/** r[n] = b[n] == 1 ? 0 : a[n] */
export type bitClear <a extends n64, b extends n64> = and<a, not<b>>;
export type imply <a extends n64, b extends n64> = or<not<a>, b>;

/** d: dg => count of set bits in d as byte */
type onesInDg = {
	0: [0, 0], 1: [1, 0], 2:  [1, 0], 3:  [2, 0], 4:  [1, 0], 5:  [2, 0], 6:  [2, 0], 7:  [3, 0], 
	8: [1, 0], 9: [2, 0], 10: [2, 0], 11: [3, 0], 12: [2, 0], 13: [3, 0], 14: [3, 0], 15: [4, 0]
} 
/** count set bits (ones) in a nb, returns a byte */
export type countBits <nb extends n64> = add8<
	// count in each dg, then sum all
	add8<
		add8<add8<onesInDg[nb[0 ]], onesInDg[nb[1 ]]>, add8<onesInDg[nb[2 ]], onesInDg[nb[3 ]]>>,
		add8<add8<onesInDg[nb[4 ]], onesInDg[nb[5 ]]>, add8<onesInDg[nb[6 ]], onesInDg[nb[7 ]]>>
	>, add8<
		add8<add8<onesInDg[nb[8 ]], onesInDg[nb[9 ]]>, add8<onesInDg[nb[10]], onesInDg[nb[11]]>>,
		add8<add8<onesInDg[nb[12]], onesInDg[nb[13]]>, add8<onesInDg[nb[14]], onesInDg[nb[15]]>>
	>
>;
/** count unset bits (zero) in a nb, returns a byte */
export type countZeros <nb extends n64> = countBits<not<nb>>
/** count set bits (ones) in a n16, returns a dg */
export type countBits16 <nb extends n16> = 
	// count in each dg, then sum all
	add8<add8<onesInDg[nb[0]], onesInDg[nb[1]]>, add8<onesInDg[nb[2]], onesInDg[nb[3]]>>[0]


/** d: dg => count of zeros at right of d */
type ctzDg = {
	0: 4, 1: 0, 2: 1, 3: 0, 4: 2, 5: 0, 6: 1, 7: 0, 8: 3, 9: 0, 10: 1, 11: 0, 12: 2, 13: 0, 14: 1, 15: 0
}
/** count trailing zeros loop over dg */
type ctzOp <nb extends Dg[], acc extends Byte> = 
	nb extends [infer dg extends Dg, ...infer rest extends Dg[]] ? 
		dg extends 0 ? ctzOp<rest, add8<acc, [4, 0]>> : add8<acc, [ctzDg[dg], 0]> :
	[0, 4];
/** count trailing (to right) zeros in a nb, returns a byte */
export type ctz <nb extends n64> = ctzOp<nb, [0, 0]>;

/** d: dg => count of zeros at left of d */
type clzDg = {
	0: 4, 1: 3, 2: 2, 3: 2, 4: 1, 5: 1, 6: 1, 7: 1, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0
}
/** count leading zeros loop over dg */
type clzOp <nb extends Dg[], acc extends Byte> = 
	nb extends [...infer rest extends Dg[], infer dg extends Dg] ? 
		dg extends 0 ? clzOp<rest, add8<acc, [4, 0]>> : add8<acc, [clzDg[dg], 0]> :
	[0, 4];
/** count leading (to left) zeros in a nb, returns a byte */
export type clz <nb extends n64> = clzOp<nb, [0, 0]>;

/** count trailing (to right) ones in a nb, returns a byte */
export type cto <nb extends n64> = ctz<not<nb>>;
/** count leading (to left) ones in a nb, returns a byte */
export type clo <nb extends n64> = clz<not<nb>>;
/** count leading (to left) sign bit in a nb, returns a byte */
export type cls <nb extends n64> = sign<nb> extends 0 ? clz<nb> : cto<nb>;

/** d: dg => reverse_bits(d) */
type revDg = {
	0: 0, 1: 8, 2: 4, 3: 12, 4: 2, 5: 10, 6: 6, 7: 14, 8: 1, 9: 9, 10: 5, 11: 13, 12: 3, 13: 11, 14: 7, 15: 15
};
/** reverse bits of a nb */
export type rev <nb extends n64> = 
	{[ K in Dg ]: revDg[nb[K]]} extends infer nb extends Record<Dg, Dg> ? [
		nb[15], nb[14], nb[13], nb[12], nb[11], nb[10], nb[9], nb[8],
		nb[7 ], nb[6 ], nb[5 ], nb[4 ], nb[3 ], nb[2 ], nb[1], nb[0]
	] : 
never;

/** reverse bytes of a nb */
export type rev8 <nb extends n64> = [
	nb[14], nb[15], nb[12], nb[13], nb[10], nb[11], nb[8], nb[9],
	nb[6 ], nb[7 ], nb[4 ], nb[5 ], nb[2 ], nb[3 ], nb[0], nb[1]
];
/** reverse b16 of a nb */
export type rev16 <nb extends n64> = [
	nb[12], nb[13], nb[14], nb[15], nb[8], nb[9], nb[10], nb[11],
	nb[4 ], nb[5 ], nb[6 ], nb[7 ], nb[0], nb[1], nb[2], nb[3]
];
/** reverse b32 of a nb */
export type rev32 <nb extends n64> = [
	nb[8], nb[9], nb[10], nb[11], nb[12], nb[13], nb[14], nb[15],
	nb[0], nb[1], nb[2 ], nb[3 ], nb[4 ], nb[5 ], nb[6 ], nb[7 ]
];

/** d: dg => b0 ^ b1 ^ b2 ^ b3 */
type redXorDg = {
	0: 0, 1: 1, 2: 0, 3: 1, 4: 0, 5: 1, 6: 0, 7: 1, 8: 0, 9: 1, 10: 0, 11: 1, 12: 0, 13: 1, 14: 0, 15: 1	
}
/** xor all bits of a n16, returns a bit */
export type redXor16 <nb extends n16> =
	// red_xor_dg(d0 ^ d1 ^ d2 ^ d3)
	redXorDg[xorTable[xorTable[nb[0]][nb[1]]][xorTable[nb[2]][nb[3]]]];