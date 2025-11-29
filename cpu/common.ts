import type { put } from "../common/utils.ts";
import type { Bits, bits, bits2dg, Dg, dgTou2u2, n12, n16, n64, one, Quat, zero } from "../math/format.ts";
import type { Extate, RegNb as RegNb } from "./index.ts";

/** b5 str => u5 */
type b5ToU5 = {
	'00000': 0,  '10000': 1,  '01000': 2,  '11000': 3,  '00100': 4,  '10100': 5,  '01100': 6,  '11100': 7,
	'00010': 8,  '10010': 9,  '01010': 10, '11010': 11, '00110': 12, '10110': 13, '01110': 14, '11110': 15,
	'00001': 16, '10001': 17, '01001': 18, '11001': 19, '00101': 20, '10101': 21, '01101': 22, '11101': 23,
	'00011': 24, '10011': 25, '01011': 26, '11011': 27, '00111': 28, '10111': 29, '01111': 30, '11111': 31
}

/** decode register field into reg nb */
export type decReg <bits extends [0 | 1, 0 | 1, 0 | 1, 0 | 1, 0 | 1]> =
	b5ToU5[`${bits[0]}${bits[1]}${bits[2]}${bits[3]}${bits[4]}`];

/** decode 3 register field into reg nbs */
// field: 0:reg0:reg1:reg2
export type dec3regs <field extends n16> = 
	[bits[field[0]], bits[field[1]], bits[field[2]], bits[field[3]]] extends 
		[infer f0 extends Bits, infer f1 extends Bits, infer f2 extends Bits, infer f3 extends Bits] ?
	[
		reg0: b5ToU5[`${f0[1]}${f0[2]}${f0[3]}${f1[0]}${f1[1]}`], 
		reg1: b5ToU5[`${f1[2]}${f1[3]}${f2[0]}${f2[1]}${f2[2]}`], 
		reg2: b5ToU5[`${f2[3]}${f3[0]}${f3[1]}${f3[2]}${f3[3]}`]
	] : never;

/** decode 2 register field into reg nbs */
// field: 00:reg1:reg2
export type dec2regs <field extends n12> =
	[bits[field[0]], bits[field[1]], bits[field[2]]] extends 
		[infer f0 extends Bits, infer f1 extends Bits, infer f2 extends Bits] ?
	[
		reg1: b5ToU5[`${f0[2]}${f0[3]}${f1[0]}${f1[1]}${f1[2]}`], 
		reg2: b5ToU5[`${f1[3]}${f2[0]}${f2[1]}${f2[2]}${f2[3]}`]
	] : never;

/** decode 4 register field into reg nbs */
// field: reg0:reg1:reg2:reg3
export type dec4regs <field extends [...n16, Dg]> =
	[bits[field[0]], bits[field[1]], bits[field[2]], bits[field[3]], bits[field[4]]] extends 
		[infer f0 extends Bits, infer f1 extends Bits, infer f2 extends Bits, infer f3 extends Bits, infer f4 extends Bits] ?
	[
		reg0: b5ToU5[`${f0[0]}${f0[1]}${f0[2]}${f0[3]}${f1[0]}`],
		reg1: b5ToU5[`${f1[1]}${f1[2]}${f1[3]}${f2[0]}${f2[1]}`],
		reg2: b5ToU5[`${f2[2]}${f2[3]}${f3[0]}${f3[1]}${f3[2]}`],
		reg3: b5ToU5[`${f3[3]}${f4[0]}${f4[1]}${f4[2]}${f4[3]}`]
	] : never;

/** read a register */
export type readReg <ext extends Extate, reg extends RegNb> = 
	reg extends 0 ? zero : ext['regs'][reg];

/** write a register, returning new extate */
export type writeReg <ext extends Extate, reg extends RegNb, val extends n64> = 
	// short circuit on reg0
	reg extends 0 ? ext : { 
		// pass through other fields
		pc: ext['pc'], conds: ext['conds'], mem: ext['mem'],
		regs: put<ext['regs'], reg, val>
	}

/** write a register with flags, returning new extate */
export type writeRegWFlags <ext extends Extate, reg extends RegNb, val extends n64, flags extends 0 | 1> = 
	bits[ext['conds'][0]] extends infer c0 extends Bits ? { 
		// pass through other fields
		pc: ext['pc'], mem: ext['mem'],
		conds: [bits2dg<[flags, c0[1], c0[2], c0[3]]>, ext['conds'][1], ext['conds'][2], ext['conds'][3]],
		regs: reg extends 0 ? ext['regs'] : put<ext['regs'], reg, val>
	} :
never;

/** write 2 registers, returning new extate */
export type write2Regs <ext extends Extate, reg1 extends RegNb, reg2 extends RegNb, val extends [n64, n64]> = {
	// pass through other fields
	pc: ext['pc'], conds: ext['conds'], mem: ext['mem'],
	// write reg1 then reg2
	regs: put<
		put<ext['regs'], reg1, reg1 extends 0 ? zero : val[0]>, 
		reg2, reg2 extends 0 ? zero : val[1]
	>
}

/** read a condition, optionally inverted */
export type readCond <ext extends Extate, cond extends Dg, not extends 0 | 1> = 
	// split into bit_ind: quat, dg_ind: quat
	dgTou2u2[cond] extends [infer bit extends Quat, infer dg extends Quat] ?
	// read cond, optionally invert it
	bits[ext['conds'][dg]][bit] extends 0 ? 
		not extends 0 ? 0 : 1 :
		not extends 0 ? 1 : 0 :
never;

/** write a condition, returning new extate */
export type writeCond <ext extends Extate, cond extends Dg, val extends 0 | 1> =
	// split into bit_ind: quat, dg_ind: quat
	dgTou2u2[cond] extends [infer bit extends Quat, infer dg extends Quat] ? {
		// pass through other fields
		pc: ext['pc'], regs: ext['regs'], mem: ext['mem'],
		conds: ext['conds'] extends 
			[infer c0 extends Dg, infer c1 extends Dg, infer c2 extends Dg, infer c3 extends Dg] ?
			// write effected dg
			dg extends 0 ? [writeBit<c0, bit, val>, c1, c2, c3] :
			dg extends 1 ? [c0, writeBit<c1, bit, val>, c2, c3] :
			dg extends 2 ? [c0, c1, writeBit<c2, bit, val>, c3] :
			dg extends 3 ? [c0, c1, c2, writeBit<c3, bit, val>] : 
			never : never
	} : never;

/** write bit at pos into dg */
type writeBit <prev extends Dg, bit extends Quat, val extends 0 | 1> =
	// split dg, do work, then merge
	bits[prev] extends infer prev extends Bits ? bits2dg<
		// write effected bit
		bit extends 0 ? [val, prev[1], prev[2], prev[3]] :
		bit extends 1 ? [prev[0], val, prev[2], prev[3]] :
		bit extends 2 ? [prev[0], prev[1], val, prev[3]] :
		bit extends 3 ? [prev[0], prev[1], prev[2], val] :
	never> : never;

/** write all conditions, returning new extate */
export type writeConds <ext extends Extate, conds extends n16> = {
	pc: ext['pc'], regs: ext['regs'], mem: ext['mem'], conds: conds
}
