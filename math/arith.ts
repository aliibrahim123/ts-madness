import type { sign } from "./comp.ts";
import type { Bits, bits, Byte, Dg, Nb, one, u68, zero } from "./format.ts";
import type { and, not, not8, or } from "./logic.ts";
import type { shift128, shift68 } from "./shift.ts";
import type { add as addTable } from "./tables.ts";

type addDg <a extends Dg[], b extends Dg[], ind extends number, res extends [0 | 1, Dg[]]> = 
	addTable[res[0]][a[ind]][b[ind]] extends [infer s, infer c] ?
	[c, [...res[1], s]] extends infer res extends [0 | 1, Dg[]] ? 
	res : never : never;

export type addOp <a extends Dg[], b extends Dg[], c extends 0 | 1 = 0> = 
	addDg<a, b, 15, addDg<a, b, 14, addDg<a, b, 13, addDg<a, b, 12, 
	addDg<a, b, 11, addDg<a, b, 10, addDg<a, b, 9,  addDg<a, b, 8, 
	addDg<a, b, 7,  addDg<a, b, 6,  addDg<a, b, 5,  addDg<a, b, 4, 
	addDg<a, b, 3,  addDg<a, b, 2,  addDg<a, b, 1,  addDg<a, b, 0, 
	[c, []] >>>>>>>>>>>>>>>>;

export type add <a extends Nb, b extends Nb, carry extends 0 | 1 = 0> = addOp<a, b, carry>[1];
export type sub <a extends Nb, b extends Nb> = addOp<a, not<b>, 1>[1];
export type neg <a extends Nb> = addOp<not<a>, zero, 1>[1];
export type abs <a extends Nb> = sign<a> extends 0 ? a : neg<a>;

export type add8 <a extends Byte, b extends Byte, carry extends 0 | 1 = 0> = 
	addDg<a, b, 1, addDg<a, b, 0, [carry, []] >>[1];
export type sub8 <a extends Byte, b extends Byte> = add8<a, not8<b>, 1>;

type zero68 = [0, ...zero];
type add68 <a extends u68, b extends u68> = addDg<a, b, 16, addOp<a, b>>[1]
type multDg <a extends Nb, b extends Dg, state extends [Dg[], Nb]> = 
	[bits[b], state[1]] extends [infer b extends Bits, infer acc extends Nb] ?
	add68<[...acc, 0], add68<
		add68<b[0] extends 1 ? [...a, 0]     : zero68, b[1] extends 1 ? shift68<a, 1> : zero68>,
		add68<b[2] extends 1 ? shift68<a, 2> : zero68, b[3] extends 1 ? shift68<a, 3> : zero68>
	>> extends [infer prod0, ...infer prodRest] ?
	[[...state[0], prod0], prodRest] :
never : never;
export type mult <a extends Nb, b extends Nb> = 
	multDg<a, b[15], multDg<a, b[14], multDg<a, b[13], multDg<a, b[12],
	multDg<a, b[11], multDg<a, b[10], multDg<a, b[9 ], multDg<a, b[8 ], 
	multDg<a, b[7 ], multDg<a, b[6 ], multDg<a, b[5 ], multDg<a, b[4 ], 
	multDg<a, b[3 ], multDg<a, b[2 ], multDg<a, b[1 ], multDg<a, b[0 ], 
	[[], zero] >>>>>>>>>>>>>>>>

type udiv <div extends Nb, acc extends [Nb, Nb]> =
	shift128<acc[0], acc[1]> extends [infer quo extends Nb, infer acc extends Nb] ?
	sub<acc, div> extends infer newacc extends Nb ?
	(sign<newacc> extends 0 ? [or<quo, one>, newacc] : [quo, acc]
	) extends infer res extends [Nb, Nb] ? res :
never : never : never;
type udiv8 <div extends Nb, acc extends [Nb, Nb]> =
	udiv<div, udiv<div, acc>> extends infer acc extends [Nb, Nb] ?
	udiv<div, udiv<div, acc>> extends infer acc extends [Nb, Nb] ?
	udiv<div, udiv<div, acc>> extends infer acc extends [Nb, Nb] ?
	udiv<div, udiv<div, acc>> extends infer acc extends [Nb, Nb] ?
acc : never : never : never : never;
type udiv64 <div extends Nb, acc extends [Nb, Nb]> = 
	udiv8<div, udiv8<div, acc>> extends infer acc extends [Nb, Nb] ?
	udiv8<div, udiv8<div, acc>> extends infer acc extends [Nb, Nb] ?
	udiv8<div, udiv8<div, acc>> extends infer acc extends [Nb, Nb] ?
	udiv8<div, udiv8<div, acc>> extends infer acc extends [Nb, Nb] ?
acc : never: never : never : never;
export type div <a extends Nb, b extends Nb> =
	b extends zero ? [zero, a] :
	[abs<a>, abs<b>] extends [infer ua extends Nb, infer ub extends Nb] ?
	udiv64<ub, [ua, zero]> extends [infer quo extends Nb, infer rem extends Nb] ?
	[add<sign<a> extends sign<b> ? quo : neg<quo>, zero>, sign<a> extends 0 ? rem : neg<rem>] :
never : never