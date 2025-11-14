import type { sub } from "./arith.ts";
import type { bit, Nb, zero } from "./format.ts";

export type isZero <nb extends Nb> = nb extends zero ? true : false;
export type isNeg <nb extends Nb> = bit<nb, 15, 3> extends 1 ? true : false;
export type sign <nb extends Nb> = bit<nb, 15, 3>;

export type comp <a extends Nb, b extends Nb> = 
	// compute diff
	sub<a, b> extends infer diff extends Nb ?
		// diff == 0 => a == b
		diff extends zero ? 0 :
		sign<a> extends sign<b> ? 
			// equal sign, based on diff, diff > 0 => a > b
        	sign<diff> extends 0 ? 1 : -1 :
			// in different signs, diff overflow, so check based on sign 
			// a > 0 => a > b
          	sign<a> extends 0 ? 1 : -1 :
	never;

export type eq <a extends Nb, b extends Nb> = sub<a, b> extends 0 ? true : false;
export type gt <a extends Nb, b extends Nb> = comp<a, b> extends 1 ? true : false;
export type lt <a extends Nb, b extends Nb> = comp<a, b> extends -1 ? true : false;