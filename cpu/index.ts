// TEEP: Type encoded expressions processor
// a simple featurefull 64 bit risc cpu emulated in typescript

import type { add8 } from "../math/arith.ts";
import type { Byte, n16, n16ToBase256, n32, n64, zero, zero16 } from "../math/format.ts";
import type { execBranch } from "./branch.ts";
import type { execDPI } from "./dpi.ts";
import type { execDPR } from "./dpr.ts";
import type { execMem } from "./mem.ts";

export type Mem = Record<number, Record<number, n64>>;
export type IRom = Record<number, Record<number, n32>>;

export type RegNb = 
	0  | 1  | 2  | 3  | 4  | 5  | 6  | 7  | 8  | 9  | 10 | 11 | 12 | 13 | 14 | 15 | 
	16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31;
export interface Extate {
	pc: n16,
	regs: Record<RegNb, n64>,
	conds: n16,
	mem: Mem
}

export type run<irom extends IRom, mem extends Mem> = 
	tick<{ 
		pc: zero16, regs: Record<RegNb, zero>, conds: zero16, mem: mem 
	}, irom, [0, 0]>;

type maxClock = [0, 2];
type tick <ext extends Extate, irom extends IRom, clock extends Byte> = 
	add8<clock, [1, 0]> extends infer clock extends Byte ?
	clock extends maxClock ? ext : tick<exec<ext, irom>, irom, clock> :
never;

type exec <ext extends Extate, irom extends IRom> = 
	n16ToBase256<ext['pc']> extends [infer pc0 extends number, infer pc1 extends number] ?
	irom[pc1][pc0] extends infer ins extends n32 ?
		ins[0] extends 0 ? execDPR<ins, ext> :
		ins[1] extends 1 ? execDPI<ins, ext> :
		ins[2] extends 2 ? execMem<ins, ext> :
		ins[2] extends 3 ? execBranch<ins, ext> :
	
never : never : never;