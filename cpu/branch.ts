import type { Bits, bits, Byte, Dg, n16, n32, n64ToN16 } from "../math/format.ts";
import type { decReg, readCond } from "./common.ts";
import type { Extate } from "./index.ts";

export type execBranch <ins extends n32, ext extends Extate> = 
	ins extends [Dg, 0, infer op extends Dg, ...infer rest extends Dg[]] ?
		op extends 0 ? rest extends [0, ...infer address extends n16] ?
			jumpTo<ext, address> : never :
		op extends 1 ? rest extends [0, 0, 0, ...infer reg extends Byte] ?
			jumpToReg<ext, reg> : never :
		op extends 4 ? rest extends [infer cond extends Dg, ...infer address extends n16] ?
			readCond<ext, cond, 0> extends 1 ? jumpTo<ext, address> : ext : never :
		op extends 5 ? rest extends [infer cond extends Dg, ...infer address extends n16] ?
			readCond<ext, cond, 1> extends 1 ? jumpTo<ext, address> : ext : never :
		op extends 6 ? rest extends [infer cond extends Dg, 0, 0, ...infer reg extends Byte] ?
			readCond<ext, cond, 0> extends 1 ? jumpToReg<ext, reg> : ext : never :
		op extends 7 ? rest extends [infer cond extends Dg, 0, 0, ...infer reg extends Byte] ?
			readCond<ext, cond, 1> extends 1 ? jumpToReg<ext, reg> : ext : never :
never : never;

type jumpToReg <ext extends Extate, reg extends Byte> = 
	[bits[reg[0]], bits[reg[1]]] extends [infer reg0 extends Bits, infer reg1 extends Bits] ?
		jumpTo<ext, n64ToN16<ext['regs'][decReg<[reg0[3], ...reg1]>]>> :
	never;

type jumpTo <ext extends Extate, address extends n16> = {
	pc: address, regs: ext['regs'], conds: ext['conds'], mem: ext['mem']
}