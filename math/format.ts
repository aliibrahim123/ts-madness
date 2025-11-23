// compute 2^64 math in hexadicimal
// binary and quaternary are very long
// base 256 is huge for hardcoded tables
// hexadicimal is not so long and is reasonably small in hardcoded tables

import type { toCharsRev } from "../common/string.ts";
import type { reverseObj, satisfies } from "../common/utils.ts";
import type { neg } from "./arith.ts";
import type { sign } from "./comp.ts";
import type { bin2dg as bin2dgTable, bits as bitsTable, bitsToDg as bitsToDg, dg2str as dg2strTable, nOnes as nOnesTable, u2u4_u6 as u2u4_u6Table, u6_u4u2 as u6_u4u2Table, dgTou2u2 as dgTou2u2Table } from "./format_tables.ts";
import type { asBase256 } from "./tables.ts";

/** hexadicimal digit */
export type Dg = 
	0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

/** quaternary digit */
export type Quat = 0 | 1 | 2 | 3;
export type Octal = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** 64 little endian bit number, 16 digits */
export type n64 = [
	Dg, Dg, Dg, Dg, Dg, Dg, Dg, Dg, 
	Dg, Dg, Dg, Dg, Dg, Dg, Dg, Dg
];
/** 8 bit number, 2 digits */
export type Byte = [Dg, Dg];
export type n12 = [Dg, Dg, Dg];
/** 16 bit number, 4 digits */
export type n16 = [Dg, Dg, Dg, Dg];
/** 32 bit number, 8 digits */
export type n32 = [Dg, Dg, Dg, Dg, Dg, Dg, Dg, Dg];
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
export type zero16 = [0, 0, 0, 0];
export type one = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

/** a digit in binary */
export type Bits = [0 | 1, 0 | 1, 0 | 1, 0 | 1];
/** d: dg => b4 */
export type bits = bitsTable;
/** get bit at bit pos of base dg */
export type bit <nb extends n64, base extends Dg, bit extends Quat> = 
	bits[nb[base]][bit]

/** convert a bit array to a dg */
export type bits2dg <nb extends Bits> =
	satisfies<bitsToDg[nb[3]][nb[2]][nb[1]][nb[0]], Dg>;

export type byte2n64 <nb extends Byte> =
	[nb[0], nb[1], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

export type n16ToN64 <nb extends n16> =
	[nb[0], nb[1], nb[2], nb[3], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

export type n64ToN16 <nb extends n64> =
	[nb[0], nb[1], nb[2], nb[3]]

export type byte2base256 <nb extends Byte> = 
	asBase256[nb[1]][nb[0]];

export type n16ToBase256 <nb extends n16> =
	[asBase256[nb[1]][nb[0]], asBase256[nb[3]][nb[2]]]

/** split a u6 byte into high u4 (dg) and low u2 (quat) */
export type u6_u4u2 <nb extends Byte> = 
	u6_u4u2Table[satisfies<nb[1], Quat>][nb[0]]

export type u2u4_u6 <nb extends [Quat, Dg]> =
	u2u4_u6Table[nb[1]][nb[0]]

export type dgTou2u2 = dgTou2u2Table

/** hex str => dg */
type str2dg = reverseObj<dg2strTable>

/** convert a number into unsigned hex string */
export type nb2str <nb extends n64> = `${
	dg2strTable[nb[15]]}${dg2strTable[nb[14]]}${dg2strTable[nb[13]]}${dg2strTable[nb[12]]}${
	dg2strTable[nb[11]]}${dg2strTable[nb[10]]}${dg2strTable[nb[9]] }${dg2strTable[nb[8]] }${
	dg2strTable[nb[7]] }${dg2strTable[nb[6]] }${dg2strTable[nb[5]] }${dg2strTable[nb[4]] }${
	dg2strTable[nb[3]] }${dg2strTable[nb[2]] }${dg2strTable[nb[1]] }${dg2strTable[nb[0]]
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

type bin = keyof bin2dgTable;
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
	asN64<{ [ K in Dg]: bin2dgTable[chars[K]] }> :
	never;

/** dg => b4 str */
type dg2bin = reverseObj<bin2dgTable>;
/** convert a number into a bin string */
export type nb2bin <nb extends n64> = `${
	dg2bin[nb[15]]}${dg2bin[nb[14]]}${dg2bin[nb[13]]}${dg2bin[nb[12]]}${
	dg2bin[nb[11]]}${dg2bin[nb[10]]}${dg2bin[nb[9]] }${dg2bin[nb[8]] }${
	dg2bin[nb[7]] }${dg2bin[nb[6]] }${dg2bin[nb[5]] }${dg2bin[nb[4]] }${
	dg2bin[nb[3]] }${dg2bin[nb[2]] }${dg2bin[nb[1]] }${dg2bin[nb[0]]
}`

export type f = 15;
export type nOnes <width extends Byte> =
	nOnesTable[satisfies<width[1], Quat>][width[0]];
export type mod8 = {
	0: 0; 1: 1; 2: 2; 3: 3; 4: 4; 5: 5; 6: 6; 7: 7; 8: 0; 9: 1; 10: 2; 11: 3; 12: 4; 13: 5; 14: 6; 15: 7;
};
