import type { put } from "../common/utils.ts";
import type { add16 } from "../math/arith.ts";
import type { Bits, bits, Byte, Dg, n12, n16, n32, n64ToN16 } from "../math/format.ts";
import type { dec2regs, decReg, readCond } from "./common.ts";
import type { Extate, RegNb } from "./index.ts";

type u1u4Tou5 = {
	0: {
		0: 0,  1: 2,  2:  4,  3:  6,  4:  8,  5:  10, 6:  12, 7: 14, 
		8: 16, 9: 18, 10: 20, 11: 22, 12: 24, 13: 26, 14: 28, 15: 30
	},
	1: {
		0: 1,  1: 3,  2:  5,  3:  7,  4:  9,  5:  11, 6:  13, 7:  15, 
		8: 17, 9: 19, 10: 21, 11: 23, 12: 25, 13: 27, 14: 29, 15: 31
	}
}

/** execute branch instruction, grp = 3 */
export type execBranch <ins extends n32, ext extends Extate> =
	ins extends [Dg, 0, infer op extends Dg, ...infer rest extends Dg[]] ?
		op extends 0 | 1 ? rest extends [infer regHigh extends Dg, ...infer address extends n16] ? // jpl imd
			jumpAndLink<ext, address, u1u4Tou5[op][regHigh]> : never :
		op extends 2 ? rest extends [0, 0, ...infer regs extends n12] ?                        
			dec2regs<regs> extends [infer link extends RegNb, infer reg extends RegNb] ?// jml reg
			jumpAndLink<ext, n64ToN16<ext['regs'][reg]>, link> : never : never :
		op extends 4 ? rest extends [infer cond extends Dg, ...infer address extends n16] ?    // br imd
			readCond<ext, cond, 0> extends 1 ? jumpTo<ext, address> : ext : never :
		op extends 5 ? rest extends [infer cond extends Dg, ...infer address extends n16] ?    // br.n imd
			readCond<ext, cond, 1> extends 1 ? jumpTo<ext, address> : ext : never :
		op extends 6 ? rest extends [infer cond extends Dg, 0, 0, ...infer reg extends Byte] ? // br reg
			readCond<ext, cond, 0> extends 1 ? jumpToReg<ext, reg> : ext : never :
		op extends 7 ? rest extends [infer cond extends Dg, 0, 0, ...infer reg extends Byte] ? // br.n reg
			readCond<ext, cond, 1> extends 1 ? jumpToReg<ext, reg> : ext : never :
never : never;

type jumpAndLink <ext extends Extate, address extends n16, link extends RegNb> = {
	pc: add16<address, [15, 15, 15, 15]>, conds: ext['conds'], mem: ext['mem'], 
	regs: link extends 0 ? ext['regs'] : put<ext['regs'], link, ext['pc']>
}
/** jump to a register */
type jumpToReg <ext extends Extate, reg extends Byte> = 
	[bits[reg[0]], bits[reg[1]]] extends [infer reg0 extends Bits, infer reg1 extends Bits] ?
		jumpTo<ext, n64ToN16<ext['regs'][decReg<[reg0[3], ...reg1]>]>> :
	never;

/** jump to an address, returning new extate */
type jumpTo <ext extends Extate, address extends n16> = {
	// dec pc since it will be inc late in exec
	pc: add16<address, [15, 15, 15, 15]>, regs: ext['regs'], conds: ext['conds'], mem: ext['mem']
}