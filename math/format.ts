// compute 2^64 math in hexadicimal
// binary and quaternary are very long
// base 256 is huge for hardcoded tables
// hexadicimal is not so long and is reasonably small in hardcoded tables

import type { toCharsRev } from "../common/string.ts";
import type { reverseObj, satisfies } from "../common/utils.ts";
import type { neg } from "./arith.ts";
import type { sign } from "./comp.ts";

export type Dg = 
	0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;
export type Quat = 0 | 1 | 2 | 3;
// little endian
export type Nb = [
	Dg, Dg, Dg, Dg, Dg, Dg, Dg, Dg, 
	Dg, Dg, Dg, Dg, Dg, Dg, Dg, Dg
];
export type Byte = [Dg, Dg];
export type u68 = [...Nb, Dg];

export type asNB <nb extends {[K in Dg]: Dg}> = [
	nb[0], nb[1], nb[2], nb[3], nb[4], nb[5], nb[6], nb[7], 
	nb[8], nb[9], nb[10], nb[11], nb[12], nb[13], nb[14], nb[15]
];

export type allOf <dg extends Dg> = [dg, dg, dg, dg, dg, dg, dg, dg, dg, dg, dg, dg, dg, dg, dg, dg];
export type zero = allOf<0>;
export type one = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

export type Bits = [0 | 1, 0 | 1, 0 | 1, 0 | 1];
export type bits = {
	0: [0,0,0,0], 1: [1,0,0,0], 2: [0,1,0,0], 3: [1,1,0,0], 
	4: [0,0,1,0], 5: [1,0,1,0], 6: [0,1,1,0], 7: [1,1,1,0], 
	8: [0,0,0,1], 9: [1,0,0,1], 10: [0,1,0,1], 11: [1,1,0,1], 
	12: [0,0,1,1], 13: [1,0,1,1], 14: [0,1,1,1], 15: [1,1,1,1]
}
export type bit <nb extends Nb, base extends Dg, bit extends Quat> = 
	bits[nb[base]][bit]

type bitsToDgTable = [
	[[[0, 1], [2, 3]], [[4, 5], [6, 7]]], [[[8, 9], [10, 11]], [[12, 13], [14, 15]]]
];
export type bits2dg <nb extends [0 | 1, 0 | 1, 0 | 1, 0 | 1]> =
	satisfies<bitsToDgTable[nb[3]][nb[2]][nb[1]][nb[0]], Dg>;
	
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
export type u6_u4u2 <nb extends Byte> = 
	u6_u4u2Table[satisfies<nb[1], Quat>][nb[0]]

type dg2str = {
	0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 
	8: '8', 9: '9', 10: 'a', 11: 'b', 12: 'c', 13: 'd', 14: 'e', 15: 'f'
};
type str2dg = reverseObj<dg2str>

export type nb2str <nb extends Nb> = `${
	dg2str[nb[15]]}${dg2str[nb[14]]}${dg2str[nb[13]]}${dg2str[nb[12]]}${
	dg2str[nb[11]]}${dg2str[nb[10]]}${dg2str[nb[9]] }${dg2str[nb[8]] }${
	dg2str[nb[7]] }${dg2str[nb[6]] }${dg2str[nb[5]] }${dg2str[nb[4]] }${
	dg2str[nb[3]] }${dg2str[nb[2]] }${dg2str[nb[1]] }${dg2str[nb[0]]
}`

type pad16 <nb extends string[], fill extends string> = 
	nb['length'] extends 16 ? nb : pad16<[...nb, fill], fill>

type str2nbDgOnly <str extends string> = 
	pad16<toCharsRev<str>, '0'> extends infer chars extends (keyof str2dg)[] ?
	asNB<{ [ K in Dg]: str2dg[chars[K]] }> :
	never;
export type str2nb <str extends string> = 
	str extends `-${infer str}` ? neg<str2nbDgOnly<str>> : str2nbDgOnly<str>

export type snb2str <nb extends Nb> =
	sign<nb> extends 1 ? `-${nb2str<neg<nb>>}` : nb2str<nb>

type bin2dg = {
	'0000': 0, '0001': 1, '0010': 2,  '0011': 3,  '0100': 4,  '0101': 5,  '0110': 6,  '0111': 7,
	'1000': 8, '1001': 9, '1010': 10, '1011': 11, '1100': 12, '1101': 13, '1110': 14, '1111': 15
}
type bin = keyof bin2dg;
type splitBin <str extends string, res extends bin[] = []> = 
	str extends `${infer d0}${infer d1}${infer d2}${infer d3}${infer rest}` ? 
	splitBin<rest, [satisfies<`${d0}${d1}${d2}${d3}`, bin>, ...res]> : res;

export type bin2nb <str extends string> = 
	pad16<splitBin<str>, '0000'> extends infer chars extends bin[] ?
	asNB<{ [ K in Dg]: bin2dg[chars[K]] }> :
	never;

type dg2bin = reverseObj<bin2dg>;
export type nb2bin <nb extends Nb> = `${
	dg2bin[nb[15]]}${dg2bin[nb[14]]}${dg2bin[nb[13]]}${dg2bin[nb[12]]}${
	dg2bin[nb[11]]}${dg2bin[nb[10]]}${dg2bin[nb[9]] }${dg2bin[nb[8]] }${
	dg2bin[nb[7]] }${dg2bin[nb[6]] }${dg2bin[nb[5]] }${dg2bin[nb[4]] }${
	dg2bin[nb[3]] }${dg2bin[nb[2]] }${dg2bin[nb[1]] }${dg2bin[nb[0]]
}`