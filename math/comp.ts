import type { sub, subOp } from "./arith.ts";
import type { bit, n64, zero } from "./format.ts";

export type isZero <nb extends n64> = nb extends zero ? 1 : 0;
/** check if nb is negative */
export type isNeg <nb extends n64> = bit<nb, 15, 3> extends 1 ? 1 : 0;
/** get sign bit of a nb, 0 if positive, 1 if negative */
export type sign <nb extends n64> = bit<nb, 15, 3>;

/** compare a and b, return 0 if eq, 1 if a gt, -1 if a lt */
export type comp <a extends n64, b extends n64> = 
	// compute diff
	sub<a, b> extends infer diff extends n64 ?
		// diff == 0 => a == b
		diff extends zero ? 0 :
		sign<a> extends sign<b> ? 
			// equal sign, based on diff, diff > 0 => a > b
        	sign<diff> extends 0 ? 1 : -1 :
			// in different signs, diff overflow, so check based on sign 
			// a > 0 => a > b
          	sign<a> extends 0 ? 1 : -1 :
	never;

export type ucomp <a extends n64, b extends n64> =
	// compute diff
	subOp<a, b> extends [infer carry, infer diff extends n64] ?
		// diff == 0 => a == b
		diff extends zero ? 0 :
		// diff > 0 => a > b
		carry extends 0 ? 1 : -1 :
	never;

/** check if a and b are equal */
export type eq <a extends n64, b extends n64> = sub<a, b> extends 0 ? 1 : 0;
/** check if a is greater than b */
export type gt <a extends n64, b extends n64> = comp<a, b> extends 1 ? 1 : 0;
/** check if a is less than b */
export type lt <a extends n64, b extends n64> = comp<a, b> extends -1 ? 1 : 0;

/** return the minimum of a and b */
export type min <a extends n64, b extends n64> = gt<a, b> extends true ? b : a;
/** return the maximum of a and b */
export type max <a extends n64, b extends n64> = gt<a, b> extends true ? a : b;
export type umin <a extends n64, b extends n64> = ucomp<a, b> extends -1 ? b : a;
export type umax <a extends n64, b extends n64> = ucomp<a, b> extends -1 ? a : b;