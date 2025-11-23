import type { prettify } from "../common/utils.ts";
import type { Bits, bits, bits2dg, Dg, dgTou2u2, n12, n16, n64, Quat, zero } from "../math/format.ts";
import type { Extate, RegNb as RegNb } from "./index.ts";

type prettifyRegs <regs extends Record<RegNb, n64>> = {
	0: regs[0], 1: regs[1], 2: regs[2], 3: regs[3], 4: regs[4], 5: regs[5], 6: regs[6], 7: regs[7],
	8: regs[8], 9: regs[9], 10: regs[10], 11: regs[11], 12: regs[12], 13: regs[13], 14: regs[14], 15: regs[15],
	16: regs[16], 17: regs[17], 18: regs[18], 19: regs[19], 20: regs[20], 21: regs[21], 22: regs[22], 23: regs[23],
	24: regs[24], 25: regs[25], 26: regs[26], 27: regs[27], 28: regs[28], 29: regs[29], 30: regs[30], 31: regs[31]
}

type b5ToU5 = {
	'00000': 0,  '00001': 1,  '00010': 2,  '00011': 3,  '00100': 4,  '00101': 5,  '00110': 6,  '00111': 7,
	'01000': 8,  '01001': 9,  '01010': 10, '01011': 11, '01100': 12, '01101': 13, '01110': 14, '01111': 15,
	'10000': 16, '10001': 17, '10010': 18, '10011': 19, '10100': 20, '10101': 21, '10110': 22, '10111': 23,
	'11000': 24, '11001': 25, '11010': 26, '11011': 27, '11100': 28, '11101': 29, '11110': 30, '11111': 31
}

export type decReg <bits extends [0 | 1, 0 | 1, 0 | 1, 0 | 1, 0 | 1]> =
	b5ToU5[`${bits[0]}${bits[1]}${bits[2]}${bits[3]}${bits[4]}`];

export type dec3regs <field extends n16> = 
	[bits[field[0]], bits[field[1]], bits[field[2]], bits[field[3]]] extends 
		[infer f0 extends Bits, infer f1 extends Bits, infer f2 extends Bits, infer f3 extends Bits] ?
	[
		b5ToU5[`${f0[1]}${f0[2]}${f0[3]}${f1[0]}${f1[1]}`], 
		b5ToU5[`${f1[2]}${f1[3]}${f2[0]}${f2[1]}${f2[2]}`], 
		b5ToU5[`${f2[3]}${f3[0]}${f3[1]}${f3[2]}${f3[3]}`]
	] : never;

export type dec2regs <field extends n12> =
	[bits[field[0]], bits[field[1]], bits[field[2]]] extends 
		[infer f0 extends Bits, infer f1 extends Bits, infer f2 extends Bits] ?
	[
		b5ToU5[`${f0[2]}${f0[3]}${f1[0]}${f1[1]}${f1[2]}`], 
		b5ToU5[`${f1[3]}${f2[0]}${f2[1]}${f2[2]}${f2[3]}`]
	] : never;

export type dec4regs <field extends [...n16, Dg]> =
	[bits[field[0]], bits[field[1]], bits[field[2]], bits[field[3]], bits[field[4]]] extends 
		[infer f0 extends Bits, infer f1 extends Bits, infer f2 extends Bits, infer f3 extends Bits, infer f4 extends Bits] ?
	[
		b5ToU5[`${f0[0]}${f0[1]}${f0[2]}${f0[3]}${f1[0]}`],
		b5ToU5[`${f1[1]}${f1[2]}${f1[3]}${f2[0]}${f2[1]}`],
		b5ToU5[`${f2[2]}${f2[3]}${f3[0]}${f3[1]}${f3[2]}`],
		b5ToU5[`${f3[3]}${f4[0]}${f4[1]}${f4[2]}${f4[3]}`]
	] : never;

export type readReg <ext extends Extate, reg extends RegNb> = 
	reg extends 0 ? zero : ext['regs'][reg];

export type writeReg <ext extends Extate, reg extends RegNb, val extends n64> = 
	reg extends 0 ? ext : { 
		pc: ext['pc'], conds: ext['conds'], mem: ext['mem'],
		regs: prettifyRegs<ext['regs'] & Record<reg, val>>
	}

export type writeRegWFlags <ext extends Extate, reg extends RegNb, val extends n64, flags extends Bits> =
	reg extends 0 ? ext : { 
		pc: ext['pc'], mem: ext['mem'],
		conds: [bits2dg<flags>, ext['conds'][1], ext['conds'][2], ext['conds'][3]],
		regs: prettifyRegs<ext['regs'] & Record<reg, val>>
	}

export type write2Regs <ext extends Extate, reg1 extends RegNb, reg2 extends RegNb, val extends [n64, n64]> = {
	pc: ext['pc'], conds: ext['conds'], mem: ext['mem'],
	regs: prettifyRegs<ext['regs'] 
		& (reg1 extends 0 ? {} : Record<reg1, val[0]>) 
		& (reg2 extends 0 ? {} : Record<reg2, val[1]>)
	>
}

export type readCond <ext extends Extate, cond extends Dg, not extends 0 | 1> = 
	dgTou2u2[cond] extends [infer bit extends Quat, infer dg extends Quat] ?
	bits[ext['conds'][dg]][bit] extends 0 ? 
		not extends 0 ? 0 : 1 :
		not extends 0 ? 1 : 0 :
never;

export type writeCond <ext extends Extate, cond extends Dg, val extends 0 | 1> =
	dgTou2u2[cond] extends [infer bit extends Quat, infer dg extends Quat] ? {
		pc: ext['pc'], regs: ext['regs'], mem: ext['mem'],
		conds: ext['conds'] extends 
			[infer c0 extends Dg, infer c1 extends Dg, infer c2 extends Dg, infer c3 extends Dg] ?
			dg extends 0 ? [writeBit<c0, bit, val>, c1, c2, c3] :
			dg extends 1 ? [c0, writeBit<c1, bit, val>, c2, c3] :
			dg extends 2 ? [c0, c1, writeBit<c2, bit, val>, c3] :
			dg extends 3 ? [c0, c1, c2, writeBit<c3, bit, val>] : 
			never : never
	} : never;

export type writeConds <ext extends Extate, conds extends n16> = {
	pc: ext['pc'], regs: ext['regs'], mem: ext['mem'], conds: conds
}

type writeBit <prev extends Dg, bit extends Quat, val extends 0 | 1> =
	bits[prev] extends infer prev extends Bits ? bits2dg<
		bit extends 0 ? [val, prev[1], prev[2], prev[3]] :
		bit extends 1 ? [prev[0], val, prev[2], prev[3]] :
		bit extends 2 ? [prev[0], prev[1], val, prev[3]] :
		bit extends 3 ? [prev[0], prev[1], prev[2], val] :
	never> : never;