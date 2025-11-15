// compute 2^64 math in hexadicimal
// binary and quaternary are very long
// base 256 is huge for hardcoded tables
// hexadicimal is not so long and is reasonably small in hardcoded tables

import type { toCharsRev } from "../common/string.ts";
import type { reverseObj, satisfies } from "../common/utils.ts";
import type { neg } from "./arith.ts";
import type { sign } from "./comp.ts";

/** hexadicimal digit */
export type Dg = 
	0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

/** quaternary digit */
export type Quat = 0 | 1 | 2 | 3;
/** 64 little endian bit number, 16 digits */
export type n64 = [
	Dg, Dg, Dg, Dg, Dg, Dg, Dg, Dg, 
	Dg, Dg, Dg, Dg, Dg, Dg, Dg, Dg
];
/** 8 bit number, 2 digits */
export type Byte = [Dg, Dg];
/** 68 bit number, 17 digit */
export type n68 = [...n64, Dg];

/** convert a n64 object into an array */
export type asN64 <nb extends {[K in Dg]: Dg}> = [
	nb[0], nb[1], nb[2], nb[3], nb[4], nb[5], nb[6], nb[7], 
	nb[8], nb[9], nb[10], nb[11], nb[12], nb[13], nb[14], nb[15]
];

/** number of all digits set to */
export type allOf <dg extends Dg> = [dg, dg, dg, dg, dg, dg, dg, dg, dg, dg, dg, dg, dg, dg, dg, dg];
export type zero = allOf<0>;
export type one = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

/** a digit in binary */
export type Bits = [0 | 1, 0 | 1, 0 | 1, 0 | 1];
/** d: dg => b4 */
export type bits = {
	0: [0,0,0,0], 1: [1,0,0,0], 2: [0,1,0,0], 3: [1,1,0,0], 
	4: [0,0,1,0], 5: [1,0,1,0], 6: [0,1,1,0], 7: [1,1,1,0], 
	8: [0,0,0,1], 9: [1,0,0,1], 10: [0,1,0,1], 11: [1,1,0,1], 
	12: [0,0,1,1], 13: [1,0,1,1], 14: [0,1,1,1], 15: [1,1,1,1]
}
/** get bit at bit pos of base dg */
export type bit <nb extends n64, base extends Dg, bit extends Quat> = 
	bits[nb[base]][bit]

/** b3, b2, b1, b0 => dg */
type bitsToDgTable = [
	[[[0, 1], [2, 3]], [[4, 5], [6, 7]]], [[[8, 9], [10, 11]], [[12, 13], [14, 15]]]
];
/** convert a bit array to a dg */
export type bits2dg <nb extends Bits> =
	satisfies<bitsToDgTable[nb[3]][nb[2]][nb[1]][nb[0]], Dg>;

/** b45, b0_3 => [b01, b2_5] */
type u6_u4u2Table = {
	0: {
		0: [0, 0], 1: [1, 0], 2:  [2, 0], 3:  [3, 0], 4:  [0, 1], 5:  [1, 1], 6:  [2, 1], 7:  [3, 1], 
		8: [0, 2], 9: [1, 2], 10: [2, 2], 11: [3, 2], 12: [0, 3], 13: [1, 3], 14: [2, 3], 15: [3, 3]
	},
	1: {
		0: [0, 4], 1: [1, 4], 2:  [2, 4], 3:  [3, 4], 4:  [0, 5], 5:  [1, 5], 6:  [2, 5], 7:  [3, 5], 
		8: [0, 6], 9: [1, 6], 10: [2, 6], 11: [3, 6], 12: [0, 7], 13: [1, 7], 14: [2, 7], 15: [3, 7]
	},
	2: {
		0: [0, 8],  1: [1, 8],  2:  [2, 8], 3:   [3, 8],  4:  [0, 9],  5:  [1, 9],  6:  [2, 9],  7:  [3, 9], 
		8: [0, 10], 9: [1, 10], 10: [2, 10], 11: [3, 10], 12: [0, 11], 13: [1, 11], 14: [2, 11], 15: [3, 11]
	},
	3: {
		0: [0, 12], 1: [1, 12], 2:  [2, 12], 3:  [3, 12], 4:  [0, 13], 5:  [1, 13], 6:  [2, 13], 7:  [3, 13], 
		8: [0, 14], 9: [1, 14], 10: [2, 14], 11: [3, 14], 12: [0, 15], 13: [1, 15], 14: [2, 15], 15: [3, 15]
	}
}
/** split a u6 byte into high u4 (dg) and low u2 (quat) */
export type u6_u4u2 <nb extends Byte> = 
	u6_u4u2Table[satisfies<nb[1], Quat>][nb[0]]

/** dg => hex str */
type dg2str = {
	0: '0', 1: '1', 2:  '2', 3:  '3', 4:  '4', 5:  '5', 6:  '6', 7:  '7', 
	8: '8', 9: '9', 10: 'a', 11: 'b', 12: 'c', 13: 'd', 14: 'e', 15: 'f'
};
/** hex str => dg */
type str2dg = reverseObj<dg2str>

/** convert a number into unsigned hex string */
export type nb2str <nb extends n64> = `${
	dg2str[nb[15]]}${dg2str[nb[14]]}${dg2str[nb[13]]}${dg2str[nb[12]]}${
	dg2str[nb[11]]}${dg2str[nb[10]]}${dg2str[nb[9]] }${dg2str[nb[8]] }${
	dg2str[nb[7]] }${dg2str[nb[6]] }${dg2str[nb[5]] }${dg2str[nb[4]] }${
	dg2str[nb[3]] }${dg2str[nb[2]] }${dg2str[nb[1]] }${dg2str[nb[0]]
}`

/** pad right a string array to 16 len */
type pad16 <nb extends string[], fill extends string> = 
	nb['length'] extends 16 ? nb : pad16<[...nb, fill], fill>
/** convert a unsigned hex string into number */
type str2unb <str extends string> = 
	// convert str into (dg char)[16]
	pad16<toCharsRev<str>, '0'> extends infer chars extends (keyof str2dg)[] ?
	// convert (dg char)[16] into n64
	asN64<{ [ K in Dg]: str2dg[chars[K]] }> :
	never;
/** convert a signed hex string into number */
export type str2nb <str extends string> = 
	str extends `-${infer str}` ? neg<str2unb<str>> : str2unb<str>
/** convert a number into a signed hex string */
export type snb2str <nb extends n64> =
	sign<nb> extends 1 ? `-${nb2str<neg<nb>>}` : nb2str<nb>

/** b4 str => dg */
type bin2dg = {
	'0000': 0, '0001': 1, '0010': 2,  '0011': 3,  '0100': 4,  '0101': 5,  '0110': 6,  '0111': 7,
	'1000': 8, '1001': 9, '1010': 10, '1011': 11, '1100': 12, '1101': 13, '1110': 14, '1111': 15
}
type bin = keyof bin2dg;
/** split a bin str into a b4 str array */
type splitBin <str extends string, res extends bin[] = []> = 
	// extract first 4 chars
	str extends `${infer d0}${infer d1}${infer d2}${infer d3}${infer rest}` ? 
	// preprend to result
	splitBin<rest, [satisfies<`${d0}${d1}${d2}${d3}`, bin>, ...res]> : res;

/** convert a bin string into number */
export type bin2nb <str extends string> = 
	// split str into (b4 str)[16]
	pad16<splitBin<str>, '0000'> extends infer chars extends bin[] ?
	// convert (b4 str)[16] into n64
	asN64<{ [ K in Dg]: bin2dg[chars[K]] }> :
	never;

/** dg => b4 str */
type dg2bin = reverseObj<bin2dg>;
/** convert a number into a bin string */
export type nb2bin <nb extends n64> = `${
	dg2bin[nb[15]]}${dg2bin[nb[14]]}${dg2bin[nb[13]]}${dg2bin[nb[12]]}${
	dg2bin[nb[11]]}${dg2bin[nb[10]]}${dg2bin[nb[9]] }${dg2bin[nb[8]] }${
	dg2bin[nb[7]] }${dg2bin[nb[6]] }${dg2bin[nb[5]] }${dg2bin[nb[4]] }${
	dg2bin[nb[3]] }${dg2bin[nb[2]] }${dg2bin[nb[1]] }${dg2bin[nb[0]]
}`