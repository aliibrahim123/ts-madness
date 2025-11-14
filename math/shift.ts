import type { satisfies } from "../common/utils.ts";
import type { sub8 } from "./arith.ts";
import type { sign } from "./comp.ts";
import type { allOf, Byte, Dg, Nb, Quat, u68, u6_u4u2, zero } from "./format.ts";
import type {shift as SL1Dg} from "./tables.ts";

type shiftL1 <nb extends Dg[], fl extends Dg, a extends Quat> = [
	SL1Dg[a][nb[0 ]][fl    ], SL1Dg[a][nb[1 ]][nb[0 ]], SL1Dg[a][nb[2 ]][nb[1 ]], SL1Dg[a][nb[3 ]][nb[2 ]],
	SL1Dg[a][nb[4 ]][nb[3] ], SL1Dg[a][nb[5 ]][nb[4 ]], SL1Dg[a][nb[6 ]][nb[5 ]], SL1Dg[a][nb[7 ]][nb[6 ]],
	SL1Dg[a][nb[8 ]][nb[7] ], SL1Dg[a][nb[9 ]][nb[8 ]], SL1Dg[a][nb[10]][nb[9 ]], SL1Dg[a][nb[11]][nb[10]],
	SL1Dg[a][nb[12]][nb[11]], SL1Dg[a][nb[13]][nb[12]], SL1Dg[a][nb[14]][nb[13]], SL1Dg[a][nb[15]][nb[14]]
];
type shiftL4 <nb extends Nb, fl extends Nb, amount extends Dg> = 
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

export type funnelShift <nb extends Nb, fill extends Nb, amount extends Byte> = 
	u6_u4u2<amount> extends [infer l1 extends Quat, infer l4 extends Dg] ?
	shiftL4<nb, fill, l4> extends [infer fill extends Dg, infer nb extends Nb] ?
	shiftL1<nb, fill, l1> : 
never : never;

export type shl <nb extends Nb, amount extends Byte> = funnelShift<nb, zero, amount>;
export type shr <nb extends Nb, amount extends Byte> = 
	amount extends [0, 0] ? nb : funnelShift<zero, nb, sub8<[0, 4], amount>>;
export type rol <nb extends Nb, amount extends Byte> = funnelShift<nb, nb, amount>;
export type sar <nb extends Nb, amount extends Byte> = 
	amount extends [0, 0] ? nb :
	funnelShift<sign<nb> extends 1 ? allOf<15> : zero, nb, sub8<[0, 4], amount>>

export type shift68 <nb extends Nb, amount extends Quat> = 
	satisfies<[...shiftL1<nb, 0, amount>, SL1Dg[amount][0][nb[15]]], u68>;
export type shift128 <a extends Nb, b extends Nb> = 
	[shiftL1<a, 0, 1>, shiftL1<b, sign<a> extends 0 ? 0 : 9, 1>];
