// TEEP: Type encoded expressions processor
// a simple featurefull 64 bit risc cpu emulated in typescript

import type { add16, add8 } from "../math/arith.ts";
import type { Byte, n16, n16ToBase256, n32, n64, zero, zero16 } from "../math/format.ts";
import type { execBranch } from "./branch.ts";
import type { execDPI } from "./dpi.ts";
import type { execDPR } from "./dpr.ts";
import type { execMem } from "./mem.ts";

/** memory, of type n64[page: u8][word: u8] */
export type Mem = Record<number, Record<number, n64>>;
/** instruction rom, of type n32[page: u8][word: u8] */
export type IRom = Record<number, Record<number, n32>>;

/** register number */
export type RegNb = 
	0  | 1  | 2  | 3  | 4  | 5  | 6  | 7  | 8  | 9  | 10 | 11 | 12 | 13 | 14 | 15 | 
	16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31;
/** excutation state of the cpu */
export interface Extate {
	pc: n16,
	regs: Record<RegNb, n64>,
	conds: n16,
	mem: Mem
}

/** run cpu with irom and initial mem */
export type run<irom extends IRom, mem extends Mem> = 
	// start cpu with zero registers
	tick<{ 
		pc: zero16, regs: Record<RegNb, zero>, conds: zero16, mem: mem 
	}, irom, [0, 0]>;

type maxClock = [0, 2];
/** loop of execution */
type tick <ext extends Extate, irom extends IRom, clock extends Byte> = 
	// inc clock
	add8<clock, [0, 1]> extends infer clock extends Byte ?
	// halt if reached maxClock
	clock extends maxClock ? ext :
	// exec cur instruction 
	exec<ext, irom> extends infer ext extends Extate ?
	// halt if encountered a halt instruction
	ext['pc'] extends [15, 15, 15, 15] ? ext :
	// next tick
	tick<ext, irom, clock> :
never : never;

/** exec current instruction */
type exec <ext extends Extate, irom extends IRom> = 
	// split pc into [word: u8, page: u8]
	n16ToBase256<ext['pc']> extends [infer pc0 extends number, infer pc1 extends number] ?
	// route cur instruction based on primary group 
	(irom[pc1][pc0] extends infer ins extends n32 ?
		ins[0] extends 0 ? execDPR<ins, ext> :
		ins[1] extends 1 ? execDPI<ins, ext> :
		ins[2] extends 2 ? execMem<ins, ext> :
		ins[2] extends 3 ? execBranch<ins, ext> :
		never : never
	// inc pc
	) extends infer ext extends Extate ? { 
		pc: add16<ext['pc'], [1, 0, 0, 0]>, regs: ext['regs'], conds: ext['conds'], mem: ext['mem'] 
	} :
never : never;