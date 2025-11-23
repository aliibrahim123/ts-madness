import type { satisfies } from "../common/utils.ts";
import type { sub8 } from "./arith.ts";
import type { sign } from "./comp.ts";
import type { allOf, Byte, Dg, n64, Quat, n68, u6_u4u2, zero, nOnes, bit, bits, dgTou2u2, Octal, mod8, n32, n16 } from "./format.ts";
import type { and, not, or } from "./logic.ts";
import type { shift, shift as SL1Dg} from "./tables.ts";

/** shift left nb at dg level, taking filler for carry in */
export type shiftL1 <nb extends Dg[], fl extends Dg, a extends Quat> = [
	SL1Dg[a][nb[0 ]][fl    ], SL1Dg[a][nb[1 ]][nb[0 ]], SL1Dg[a][nb[2 ]][nb[1 ]], SL1Dg[a][nb[3 ]][nb[2 ]],
	SL1Dg[a][nb[4 ]][nb[3] ], SL1Dg[a][nb[5 ]][nb[4 ]], SL1Dg[a][nb[6 ]][nb[5 ]], SL1Dg[a][nb[7 ]][nb[6 ]],
	SL1Dg[a][nb[8 ]][nb[7] ], SL1Dg[a][nb[9 ]][nb[8 ]], SL1Dg[a][nb[10]][nb[9 ]], SL1Dg[a][nb[11]][nb[10]],
	SL1Dg[a][nb[12]][nb[11]], SL1Dg[a][nb[13]][nb[12]], SL1Dg[a][nb[14]][nb[13]], SL1Dg[a][nb[15]][nb[14]]
];
/** sheft left nb digits, taking filler for carry in, returning [l1_fl: Dg, nb] */
type shiftL4 <nb extends n64, fl extends n64, amount extends Dg> = 
	[nb, fl] extends [[
		infer n1, infer n2,  infer n3,  infer n4,  infer n5,  infer n6,  infer n7,  infer n8,
		infer n9, infer n10, infer n11, infer n12, infer n13, infer n14, infer n15, infer n16
	], [
		infer f1, infer f2,  infer f3,  infer f4,  infer f5,  infer f6,  infer f7,  infer f8,
		infer f9, infer f10, infer f11, infer f12, infer f13, infer f14, infer f15, infer f16
	]] ? 
		amount extends 0 ? [f15, nb] :
		amount extends 1 ? [f15, [f16, n1, n2, n3, n4, n5, n6, n7, n8, n9, n10, n11, n12, n13, n14, n15]] :
		amount extends 2 ? [f14, [f15, f16, n1, n2, n3, n4, n5, n6, n7, n8, n9, n10, n11, n12, n13, n14]] :
		amount extends 3 ? [f13, [f14, f15, f16, n1, n2, n3, n4, n5, n6, n7, n8, n9, n10, n11, n12, n13]] :
		amount extends 4 ? [f12, [f13, f14, f15, f16, n1, n2, n3, n4, n5, n6, n7, n8, n9, n10, n11, n12]] :
		amount extends 5 ? [f11, [f12, f13, f14, f15, f16, n1, n2, n3, n4, n5, n6, n7, n8, n9, n10, n11]] :
		amount extends 6 ? [f10, [f11, f12, f13, f14, f15, f16, n1, n2, n3, n4, n5, n6, n7, n8, n9, n10]] :
		amount extends 7 ? [f9,  [f10, f11, f12, f13, f14, f15, f16, n1, n2, n3, n4, n5, n6, n7, n8, n9]] :
		amount extends 8 ? [f8,  [f9, f10, f11, f12, f13, f14, f15, f16, n1, n2, n3, n4, n5, n6, n7, n8]] :
		amount extends 9 ? [f7,  [f8, f9, f10, f11, f12, f13, f14, f15, f16, n1, n2, n3, n4, n5, n6, n7]] :
		amount extends 10 ? [f6, [f7, f8, f9, f10, f11, f12, f13, f14, f15, f16, n1, n2, n3, n4, n5, n6]] :
		amount extends 11 ? [f5, [f6, f7, f8, f9, f10, f11, f12, f13, f14, f15, f16, n1, n2, n3, n4, n5]] :
		amount extends 12 ? [f4, [f5, f6, f7, f8, f9, f10, f11, f12, f13, f14, f15, f16, n1, n2, n3, n4]] :
		amount extends 13 ? [f3, [f4, f5, f6, f7, f8, f9, f10, f11, f12, f13, f14, f15, f16, n1, n2, n3]] :
		amount extends 14 ? [f2, [f3, f4, f5, f6, f7, f8, f9, f10, f11, f12, f13, f14, f15, f16, n1, n2]] :
		amount extends 15 ? [f1, [f2, f3, f4, f5, f6, f7, f8, f9, f10, f11, f12, f13, f14, f15, f16, n1]] :
	never : never;

/** funnel shift left a nb, taking filler for carry in */
export type funnelShift <nb extends n64, fill extends n64, amount extends Byte> = 
	// split amount for each level
	u6_u4u2<amount> extends [infer l1 extends Quat, infer l4 extends Dg] ?
	// shift digits
	shiftL4<nb, fill, l4> extends [infer fill extends Dg, infer nb extends n64] ?
	// shift withen digits
	shiftL1<nb, fill, l1> : 
never : never;

/** logically shift left a nb */
export type shl <nb extends n64, amount extends Byte> = funnelShift<nb, zero, amount>;
/** logically shift right a nb */
export type shr <nb extends n64, amount extends Byte> = 
	// shr(n) = fsl([zero<n64>, n], (64 - amount))
	amount extends [0, 0] ? nb : funnelShift<zero, nb, sub8<[0, 4], amount>>;
// rotate left a nb
export type rol <nb extends n64, amount extends Byte> = funnelShift<nb, nb, amount>;
// arithmetically shift right a nb
export type sar <nb extends n64, amount extends Byte> = 
	amount extends [0, 0] ? nb :
	// sar(n) = fsl([repeat(sign(n), 64), n], amount)
	funnelShift<sign<nb> extends 1 ? allOf<15> : zero, nb, sub8<[0, 4], amount>> 

/** shift left n68 by a quat */
export type shift68 <nb extends n64, amount extends Quat> = 
	satisfies<[...shiftL1<nb, 0, amount>, SL1Dg[amount][0][nb[15]]], n68>;
/** shift left n128 by 1 */
export type shift128 <a extends n64, b extends n64> = 
	[shiftL1<a, 0, 1>, shiftL1<b, sign<a> extends 0 ? 0 : 9, 1>];

export type bfieldExtract <nb extends n64, offset extends Byte, width extends Byte> =
	and<shl<nb, offset>, nOnes<width>>;

export type bfieldInsert <nb extends n64, base extends n64, offset extends Byte, width extends Byte> =
	nOnes<width> extends infer mask extends n64 ?
	[and<base, not<shl<mask, offset>>>, shl<and<nb, mask>, offset>] extends 
	[infer base extends n64, infer ins extends n64] ?
	or<base, ins> extends infer out extends n64 ? out : 
never : never : never;

export type signExt8 <nb extends n64> =
	bit<nb, 1, 3> extends 0 ? nb : 
	[nb[0], nb[1], 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15];

export type signExt16 <nb extends n64> =
	bit<nb, 3, 3> extends 0 ? nb : 
	[nb[0], nb[1], nb[2], nb[3], 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15];

export type signExt32 <nb extends n64> =
	bit<nb, 7, 3> extends 0 ? nb : 
	[nb[0], nb[1], nb[2], nb[3], nb[4], nb[5], nb[6], nb[7], 15, 15, 15, 15, 15, 15, 15, 15];

export type n32Part <nb extends n64, part extends 0 | 1, f extends Dg = 0> =
	part extends 0 ? [nb[0], nb[1], nb[2 ], nb[3 ], nb[4 ], nb[5 ], nb[6 ], nb[7 ], f, f, f, f, f, f, f, f] :
	part extends 1 ? [nb[8], nb[9], nb[10], nb[11], nb[12], nb[13], nb[14], nb[15], f, f, f, f, f, f, f, f] :
never;

export type n16Part <nb extends n64, part extends Quat, f extends Dg = 0> =
	part extends 0 ? [nb[0 ], nb[1 ], nb[2 ], nb[3 ], f, f, f, f, f, f, f, f, f, f, f, f] :
	part extends 1 ? [nb[4 ], nb[5 ], nb[6 ], nb[7 ], f, f, f, f, f, f, f, f, f, f, f, f] :
	part extends 2 ? [nb[8 ], nb[9 ], nb[10], nb[11], f, f, f, f, f, f, f, f, f, f, f, f] :
	part extends 3 ? [nb[12], nb[13], nb[14], nb[15], f, f, f, f, f, f, f, f, f, f, f, f] :
never;

export type bytePart <nb extends n64, part extends Octal, f extends Dg = 0> =
	part extends 0 ? [nb[0 ], nb[1 ], f, f, f, f, f, f, f, f, f, f, f, f, f, f] :
	part extends 1 ? [nb[2 ], nb[3 ], f, f, f, f, f, f, f, f, f, f, f, f, f, f] :
	part extends 2 ? [nb[4 ], nb[5 ], f, f, f, f, f, f, f, f, f, f, f, f, f, f] :
	part extends 3 ? [nb[6 ], nb[7 ], f, f, f, f, f, f, f, f, f, f, f, f, f, f] :
	part extends 4 ? [nb[8 ], nb[9 ], f, f, f, f, f, f, f, f, f, f, f, f, f, f] :
	part extends 5 ? [nb[10], nb[11], f, f, f, f, f, f, f, f, f, f, f, f, f, f] :
	part extends 6 ? [nb[12], nb[13], f, f, f, f, f, f, f, f, f, f, f, f, f, f] :
	part extends 7 ? [nb[14], nb[15], f, f, f, f, f, f, f, f, f, f, f, f, f, f] :
never;

export type mergePart32 <b extends n64, s extends n64, part extends 0 | 1> =
	part extends 0 ? [
		s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[7], b[8], b[9], b[10], b[11], b[12], b[13], b[14], b[15]
	] : part extends 1 ? [
		b[0], b[1], b[2], b[3], b[4], b[5], b[6], b[7], s[0], s[1], s[2 ], s[3 ], s[4 ], s[5 ], s[6 ], s[7 ]
	] : never;

export type mergePart16 <b extends n64, s extends n64, part extends Quat> =
	part extends 0 ? [
		s[0], s[1], s[2], s[3], b[4], b[5], b[6], b[7], b[8], b[9], b[10], b[11], b[12], b[13], b[14], b[15]
	] : part extends 1 ? [
		b[0], b[1], b[2], b[3], s[0], s[1], s[2], s[3], b[8], b[9], b[10], b[11], b[12], b[13], b[14], b[15]
	] : part extends 2 ? [
		b[0], b[1], b[2], b[3], b[4], b[5], b[6], b[7], s[0], s[1], s[2 ], s[3 ], b[12], b[13], b[14], b[15]
	] : part extends 3 ? [
		b[0], b[1], b[2], b[3], b[4], b[5], b[6], b[7], b[8], b[9], b[10], b[11], s[0 ], s[1 ], s[2 ], s[3 ]
	] : never;

export type mergePart8 <b extends n64, s extends n64, part extends Octal> =
	part extends 0 ? [
		s[0], s[1], b[2], b[3], b[4], b[5], b[6], b[7], b[8], b[9], b[10], b[11], b[12], b[13], b[14], b[15]
	] : part extends 1 ? [
		b[0], b[1], s[0], s[1], b[4], b[5], b[6], b[7], b[8], b[9], b[10], b[11], b[12], b[13], b[14], b[15]
	] : part extends 2 ? [
		b[0], b[1], b[2], b[3], s[0], s[1], b[6], b[7], b[8], b[9], b[10], b[11], b[12], b[13], b[14], b[15], 
	] : part extends 3 ? [
		b[0], b[1], b[2], b[3], b[4], b[5], s[0], s[1], b[8], b[9], b[10], b[11], b[12], b[13], b[14], b[15],
	] : part extends 4 ? [
		b[0], b[1], b[2], b[3], b[4], b[5], b[6], b[7], s[0], s[1], b[10], b[11], b[12], b[13], b[14], b[15],
	] : part extends 5 ? [
		b[0], b[1], b[2], b[3], b[4], b[5], b[6], b[7], b[8], b[9], s[0 ], s[1 ], b[12], b[13], b[14], b[15],
	] : part extends 6 ? [
		b[0], b[1], b[2], b[3], b[4], b[5], b[6], b[7], b[8], b[9], b[10], b[11], s[0 ], s[1 ], b[14], b[15],
	] : part extends 7 ? [
		b[0], b[1], b[2], b[3], b[4], b[5], b[6], b[7], b[8], b[9], b[10], b[11], b[12], b[13], s[0 ], s[1 ],
	] : never;