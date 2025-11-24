import type { put } from "../common/utils.ts";
import type { add } from "../math/arith.ts";
import type { bit, bits, Dg, dgTou2u2, mod8, n12, n16, n16ToBase256, n32, n64, n64ToN16, Quat, zero } from "../math/format.ts";
import type { bytePart, mergePart16, mergePart32, mergePart8, n16Part, n32Part, shiftL1 } from "../math/shift.ts";
import type { dec2regs, dec3regs, writeReg } from "./common.ts";
import type { lowImd } from "./dpi.ts";
import type { Extate, Mem, RegNb } from "./index.ts";

/** execute mem instruction, grp = 2 */
export type execMem <ins extends n32, ext extends Extate> = 
	ins extends [Dg, infer op extends Dg, ...infer oprand extends Dg[]] ?
	// dec oprand
	decOprand<ext, oprand, dgTou2u2[oprand[0]][0]> extends 
		[infer reg extends RegNb, infer address extends n64] ?
	// op = s:u:sz
	// s = 0, ldr
	bits[op][0] extends 0 ? writeReg<ext, reg, 
		// u = 0
		op extends 0 ? readMem<ext['mem'], address> :                                   // ldr
		op extends 1 ? n32Part<readMem<ext['mem'], address>, bit<address, 0, 0>> :      // ldr.32
		op extends 2 ? n16Part<readMem<ext['mem'], address>, dgTou2u2[address[0]][0]> : // ldr.16
		op extends 3 ? bytePart<readMem<ext['mem'], address>, mod8[address[0]]> :       // ldr.8
		// u = 1
		op extends 5 ? readMem<ext['mem'], address> extends infer val extends n64 ?     // ldr.s32
			n32Part<val, bit<address, 0, 0>, bit<val, 7, 3> extends 0 ? 0 : 15> : never :
		op extends 6 ? readMem<ext['mem'], address> extends infer val extends n64 ?     // ldr.s16
			n16Part<val, dgTou2u2[address[0]][0], bit<val, 3, 3> extends 0 ? 0 : 15> : never :
		op extends 7 ? readMem<ext['mem'], address> extends infer val extends n64 ?     // ldr.s8
			bytePart<val, mod8[address[0]], bit<val, 1, 3> extends 0 ? 0 : 15> : never :
		never
	// s = 1, str
	> : ext['regs'][reg] extends infer src extends n64 ?
		op extends 8 ? writeMem<ext, address, src> :     // str
		readMem<ext['mem'], address> extends infer word extends n64 ? 
		op extends 9 ? writeMem<ext, address, mergePart32<word, src, bit<address, 0, 0>>> :       // str.32
		op extends 10 ? writeMem<ext, address, mergePart16<word, src, dgTou2u2[address[0]][0]>> : // str.16
		op extends 11 ? writeMem<ext, address, mergePart8<word, src, mod8[address[0]]>> :         // str.8
	never :
never : never : never : never;

/** decode oprand */
type decOprand <ext extends Extate, oprand extends Dg[], size extends Quat> = 
	// base + index
	bits[oprand[0]][1] extends 0 ? 
		oprand extends [...infer regs extends n16, ...Dg[]] ?
		// dec regs
		dec3regs<regs> extends 
			[infer reg extends RegNb, infer base extends RegNb, infer index extends RegNb] ?
		// shift base and add index to it
		[reg, add<shiftAddress<ext['regs'][base], size>, ext['regs'][index]>] :
	never : never :
	// base + imd
		oprand extends [...infer regs extends n12, infer imd extends n12] ?
		// dec regs
		dec2regs<regs> extends [infer reg extends RegNb, infer base extends RegNb] ?
		// shift base and add imd to it
		[reg, add<shiftAddress<ext['regs'][base], size>, lowImd<imd>>] :
	never : never;

/** shift address based on type */
type shiftAddress <address extends n64, size extends Quat> =
	size extends 0 ? address :
	size extends 1 ? shiftL1<address, 0, 1> :
	size extends 2 ? shiftL1<address, 0, 2> :
	size extends 3 ? shiftL1<address, 0, 3> : 
never;

/** read memory */
type readMem <mem extends Mem, address extends n64> = 
	// split address
	n16ToBase256<n64ToN16<address>> extends [infer word extends number, infer page extends number] ?
	// get page
	(page extends keyof mem ? mem[page] : {}) extends infer page ?
	// get word
	word extends keyof page ? page[word] : zero :
never : never;

/** write memory, return new extate */
type writeMem <ext extends Extate, address extends n64, val extends n64> = 
	// split address
	n16ToBase256<n64ToN16<address>> extends [infer word extends number, infer page extends number] ?
	// update mem with page
	put<ext['mem'], page,  
		// store word to page
		put<page extends keyof ext['mem'] ? ext['mem'][page] : {}, word,val>
	> extends infer mem extends Mem ?
	// return new extate
	{ pc: ext['pc'], regs: ext['regs'], conds: ext['conds'], mem: mem } : 
never : never;