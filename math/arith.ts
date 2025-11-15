import type { sign } from "./comp.ts";
import type { Bits, bits, Byte, Dg, n64, one, n68, zero } from "./format.ts";
import type { and, not, not8, or } from "./logic.ts";
import type { shift128, shift68 } from "./shift.ts";
import type { add as addTable } from "./tables.ts";

/** adding loop over dg*/
type addDg <a extends Dg[], b extends Dg[], ind extends number, res extends [carry: 0 | 1, sum: Dg[]]> = 
	// add a, b and carry
	addTable[res[0]][a[ind]][b[ind]] extends [infer s, infer c] ?
	// append sum to result
	[carry: c, sum: [...res[1], s]] extends infer res extends [0 | 1, Dg[]] ? 
	res : never : never;

/** addition of 2 nb, returns [carry, sum] */
export type addOp <a extends Dg[], b extends Dg[], c extends 0 | 1 = 0> = 
	addDg<a, b, 15, addDg<a, b, 14, addDg<a, b, 13, addDg<a, b, 12, 
	addDg<a, b, 11, addDg<a, b, 10, addDg<a, b, 9,  addDg<a, b, 8, 
	addDg<a, b, 7,  addDg<a, b, 6,  addDg<a, b, 5,  addDg<a, b, 4, 
	addDg<a, b, 3,  addDg<a, b, 2,  addDg<a, b, 1,  addDg<a, b, 0, 
	[c, []] >>>>>>>>>>>>>>>>;

/** addition of 2 nb */
export type add <a extends n64, b extends n64, carry extends 0 | 1 = 0> = addOp<a, b, carry>[1];
/** subtraction of 2 nb */
export type sub <a extends n64, b extends n64> = addOp<a, not<b>, 1>[1];
/** signed negation of a */
export type neg <a extends n64> = addOp<not<a>, zero, 1>[1];
/** absolute value of a */
export type abs <a extends n64> = sign<a> extends 0 ? a : neg<a>;

/** addition of 2 bytes */
export type add8 <a extends Byte, b extends Byte, carry extends 0 | 1 = 0> = 
	addDg<a, b, 1, addDg<a, b, 0, [carry, []] >>[1];
/** subtraction of 2 bytes */
export type sub8 <a extends Byte, b extends Byte> = add8<a, not8<b>, 1>;

type zero68 = [0, ...zero];
/** addition of 2 n68 */
type add68 <a extends n68, b extends n68> = addDg<a, b, 16, addOp<a, b>>[1];

/** multiplication loop over dg */
type multDg <a extends n64, b extends Dg, state extends [res: Dg[], acc: n64]> = 
	[bits[b], acc: state[1]] extends [infer b extends Bits, infer acc extends n64] ?
	// adding acc with product
	add68<[...acc, 0], add68<
		//4 64x1 mul: sum(for n = 0 to 3: a << n * b[n])
		add68<b[0] extends 1 ? [...a, 0]     : zero68, b[1] extends 1 ? shift68<a, 1> : zero68>,
		add68<b[2] extends 1 ? shift68<a, 2> : zero68, b[3] extends 1 ? shift68<a, 3> : zero68>
	>> extends [infer prod0, ...infer prodRest] ?
	/** append product 1st dg to result, pass rest as acc */
	[res: [...state[0], prod0], acc: prodRest] :
never : never;

/** full multiplication of 2 nb, product is u128, returns [low, high] */
export type mult <a extends n64, b extends n64> = 
	multDg<a, b[15], multDg<a, b[14], multDg<a, b[13], multDg<a, b[12],
	multDg<a, b[11], multDg<a, b[10], multDg<a, b[9 ], multDg<a, b[8 ], 
	multDg<a, b[7 ], multDg<a, b[6 ], multDg<a, b[5 ], multDg<a, b[4 ], 
	multDg<a, b[3 ], multDg<a, b[2 ], multDg<a, b[1 ], multDg<a, b[0 ], 
	[[], zero] >>>>>>>>>>>>>>>>

/* ------------------------------- /*
			DANGER ZONE
	any mistake make typechecker 
			  explode
/* ------------------------------- */

/** unsigned division loop over bits */
type udiv <div extends n64, acc extends [quo: n64, acc: n64]> =
	// shift [acc, quo] by 1
	shift128<acc[0], acc[1]> extends [infer quo extends n64, infer acc extends n64] ?
	// acc - div
	sub<acc, div> extends infer newacc extends n64 ?
	// if newacc is pos, set b0 of quo to one and use newacc
	(sign<newacc> extends 0 ? [or<quo, one>, newacc] : [quo, acc]
	// make the typechecker happy
	) extends infer res extends [quo: n64, acc: n64] ? res :
never : never : never;

// loop over bits through 2 levels, withen and over bytes, while making sure that the typechecker is happy
type udiv8 <div extends n64, acc extends [n64, n64]> =
	udiv<div, udiv<div, acc>> extends infer acc extends [n64, n64] ?
	udiv<div, udiv<div, acc>> extends infer acc extends [n64, n64] ?
	udiv<div, udiv<div, acc>> extends infer acc extends [n64, n64] ?
	udiv<div, udiv<div, acc>> extends infer acc extends [n64, n64] ?
acc : never : never : never : never;
type udiv64 <div extends n64, acc extends [n64, n64]> = 
	udiv8<div, udiv8<div, acc>> extends infer acc extends [n64, n64] ?
	udiv8<div, udiv8<div, acc>> extends infer acc extends [n64, n64] ?
	udiv8<div, udiv8<div, acc>> extends infer acc extends [n64, n64] ?
	udiv8<div, udiv8<div, acc>> extends infer acc extends [n64, n64] ?
acc : never: never : never : never;

/** singed division of 2 nb, returns [quo, rem] */
export type div <a extends n64, b extends n64> =
	// fast safe path for div by zero
	b extends zero ? [zero, a] :
	// unsign the inputs
	[abs<a>, abs<b>] extends [infer ua extends n64, infer ub extends n64] ?
	// unsignly divide
	udiv64<ub, [ua, zero]> extends [infer quo extends n64, infer rem extends n64] ?
	// sign the results, quo is neg if sign(a) != sign(b), sign(rem) = sign(a)
	[add<sign<a> extends sign<b> ? quo : neg<quo>, zero>, sign<a> extends 0 ? rem : neg<rem>] :
never : never