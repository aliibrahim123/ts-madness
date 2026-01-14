import type { put, satisfies } from "../common/utils.ts";
import type { add, add16 } from "../math/arith.ts";
import type { bit, bits, Dg, dgTou2u2, mod8, n12, n16, n16ToBase256, n32, n64, n64ToN16, Quat, zero, Octal } from "../math/format.ts";
import type { bytePart, mergePart16, mergePart32, mergePart8, n16Part, n32Part, shiftL16, shiftR16 } from "../math/shift.ts";
import type { dec2regs, dec3regs, writeReg } from "./common.ts";
import type { Extate, Mem, RegNb } from "./index.ts";

/** execute mem instruction, grp = 2 */
export type execMem <ins extends n32, ext extends Extate> = 
	ins extends [Dg, infer op extends Dg, ...infer oprand extends Dg[]] ?
	// dec oprand
	decOprand<ext, oprand, dgTou2u2[op][0]> extends 
		[infer reg extends RegNb, infer address extends n16, infer low extends Dg] ?
	// op = s:u:sz
	// s = 0, ldr
	bits[op][3] extends 0 ? writeReg<ext, reg, 
		// u = 0
		op extends 0 ? readMem<ext['mem'], address> :                                   // ldr
		op extends 1 ? n32Part<readMem<ext['mem'], address>, satisfies<low, 0 | 1>> :      // ldr.32
		op extends 2 ? n16Part<readMem<ext['mem'], address>, satisfies<low, Quat>> : // ldr.16
		op extends 3 ? bytePart<readMem<ext['mem'], address>, satisfies<low, Octal>> :       // ldr.8
		// u = 1
		op extends 5 ? readMem<ext['mem'], address> extends infer val extends n64 ?     // ldr.s32
			n32Part<val, satisfies<low, 0 | 1>, bit<val, 7, 3> extends 0 ? 0 : 15> : never :
		op extends 6 ? readMem<ext['mem'], address> extends infer val extends n64 ?     // ldr.s16
			n16Part<val, satisfies<low, Quat>, bit<val, 3, 3> extends 0 ? 0 : 15> : never :
		op extends 7 ? readMem<ext['mem'], address> extends infer val extends n64 ?     // ldr.s8
			bytePart<val, satisfies<low, Octal>, bit<val, 1, 3> extends 0 ? 0 : 15> : never :
		never
	// s = 1, str
	> : ext['regs'][reg] extends infer src extends n64 ?
		op extends 8 ? writeMem<ext, address, src> :     // str
		readMem<ext['mem'], address> extends infer word extends n64 ? 
		op extends 9 ? writeMem<ext, address, mergePart32<word, src, satisfies<low, 0 | 1>>> :       // str.32
		op extends 10 ? writeMem<ext, address, mergePart16<word, src, satisfies<low, Quat>>> : // str.16
		op extends 11 ? writeMem<ext, address, mergePart8<word, src, satisfies<low, Octal>>> :         // str.8
	never :
never : never : never : never;

/** decode oprand */
type decOprand <ext extends Extate, oprand extends Dg[], size extends Quat> = 
	// base + index
	bits[oprand[0]][0] extends 0 ? 
		oprand extends [
			infer r0 extends Dg, infer r1 extends Dg, infer r2 extends Dg, infer r3 extends Dg, ...Dg[]
		// dec regs
		] ? dec3regs<[r0, r1, r2, r3]> extends 
			[infer reg extends RegNb, infer base extends RegNb, infer index extends RegNb] ?
		add16<shiftL16<ext['regs'][base], size>, n64ToN16<ext['regs'][index]>> extends 
			infer address extends n16 ?
		[reg, shiftR16<address, size>, lowAddress<address, size>] :
		// shift base and add index to it
	never : never : never : 
	// base + imd
		oprand extends [
			infer r0 extends Dg, infer r1 extends Dg, infer r2 extends Dg, ...infer imd extends n12
		] ?
		// dec regs
		dec2regs<[r0, r1, r2]> extends [infer reg extends RegNb, infer base extends RegNb] ?
		add16<shiftL16<ext['regs'][base], size>, [imd[0], imd[1], imd[2], 0]> extends 
			infer address extends n16 ?
		// shift base and add imd to it
		[reg, shiftR16<address, size>, lowAddress<address, size>] :
	never : never : never;

type lowAddress <address extends n16, size extends Quat> = 
	size extends 0 ? 0 :
	size extends 1 ? bits[address[0]][0] :
	size extends 2 ? dgTou2u2[address[0]][0] :
	size extends 3 ? mod8[address[0]] :
never;

/** read memory */
type readMem <mem extends Mem, address extends n16> = 
	// split address
	n16ToBase256<address> extends [infer word extends number, infer page extends number] ?
	// get page
	(page extends keyof mem ? mem[page] : {}) extends infer page ?
	// get word
	word extends keyof page ? page[word] : zero :
never : never;

/** write memory, return new extate */
type writeMem <ext extends Extate, address extends n16, val extends n64> = 
	// split address
	n16ToBase256<address> extends [infer word extends number, infer page extends number] ?
	// update mem with page
	put<ext['mem'], page,  
		// store word to page
		put<page extends keyof ext['mem'] ? ext['mem'][page] : {}, word,val>
	> extends infer mem extends Mem ?
	// return new extate
	{ pc: ext['pc'], regs: ext['regs'], conds: ext['conds'], mem: mem } : 
never : never;