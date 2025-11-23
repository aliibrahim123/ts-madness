import type { put } from "../common/utils.ts";
import type { add } from "../math/arith.ts";
import type { bit, bits, Dg, dgTou2u2, mod8, n12, n16, n16ToBase256, n32, n64, n64ToN16, Quat, zero } from "../math/format.ts";
import type { bytePart, mergePart16, mergePart32, mergePart8, n16Part, n32Part, shiftL1 } from "../math/shift.ts";
import type { dec2regs, dec3regs, writeReg } from "./common.ts";
import type { lowImd } from "./dpi.ts";
import type { Extate, Mem, RegNb } from "./index.ts";

export type execMem <ins extends n32, ext extends Extate> = 
	ins extends [Dg, infer op extends Dg, ...infer oprand extends Dg[]] ?
	decOprand<ext, oprand, dgTou2u2[oprand[0]][0]> extends 
		[infer reg extends RegNb, infer address extends n64] ?
	bits[op][0] extends 0 ? writeReg<ext, reg, 
		op extends 0 ? readMem<ext['mem'], address> :
		op extends 1 ? n32Part<readMem<ext['mem'], address>, bit<address, 0, 0>> :
		op extends 2 ? n16Part<readMem<ext['mem'], address>, dgTou2u2[address[0]][0]> :
		op extends 3 ? bytePart<readMem<ext['mem'], address>, mod8[address[0]]> :
		op extends 5 ? readMem<ext['mem'], address> extends infer val extends n64 ?
			n32Part<val, bit<address, 0, 0>, bit<val, 7, 3> extends 0 ? 0 : 15> : never :
		op extends 6 ? readMem<ext['mem'], address> extends infer val extends n64 ?
			n16Part<val, dgTou2u2[address[0]][0], bit<val, 3, 3> extends 0 ? 0 : 15> : never :
		op extends 7 ? readMem<ext['mem'], address> extends infer val extends n64 ?
			bytePart<val, mod8[address[0]], bit<val, 1, 3> extends 0 ? 0 : 15> : never :
		never
	> : ext['regs'][reg] extends infer src extends n64 ?
		op extends 8 ? writeMem<ext, address, src> :
		readMem<ext['mem'], address> extends infer word extends n64 ?
		op extends 9 ? writeMem<ext, address, mergePart32<word, src, bit<address, 0, 0>>> :
		op extends 10 ? writeMem<ext, address, mergePart16<word, src, dgTou2u2[address[0]][0]>> :
		op extends 11 ? writeMem<ext, address, mergePart8<word, src, mod8[address[0]]>> :
	never :
never : never : never : never;

type decOprand <ext extends Extate, oprand extends Dg[], size extends Quat> = 
	bits[oprand[0]][1] extends 0 ? 
		oprand extends [...infer regs extends n16, ...Dg[]] ?
		dec3regs<regs> extends 
			[infer reg extends RegNb, infer base extends RegNb, infer index extends RegNb] ?
		[reg, shiftAddress<add<ext['regs'][base], ext['regs'][index]>, size>] :
	never : never :
		oprand extends [...infer regs extends n12, infer imd extends n12] ?
		dec2regs<regs> extends [infer reg extends RegNb, infer base extends RegNb] ?
		[reg, shiftAddress<add<ext['regs'][base], lowImd<imd>>, size>] :
	never : never;

type shiftAddress <address extends n64, size extends Quat> =
	size extends 0 ? address :
	size extends 1 ? shiftL1<address, 0, 1> :
	size extends 2 ? shiftL1<address, 0, 2> :
	size extends 3 ? shiftL1<address, 0, 3> : 
never;

type readMem <mem extends Mem, address extends n64> = 
	n16ToBase256<n64ToN16<address>> extends [infer word extends number, infer page extends number] ?
	(page extends keyof mem ? mem[page] : {}) extends infer page ?
	word extends keyof page ? page[word] : zero :
never : never;

type writeMem <ext extends Extate, address extends n64, val extends n64> = 
	n16ToBase256<n64ToN16<address>> extends [infer word extends number, infer page extends number] ?
	put<ext['mem'], page,  
		put<page extends keyof ext['mem'] ? ext['mem'][page] : {}, word,val>
	> extends infer mem extends Mem ?
	{ pc: ext['pc'], regs: ext['regs'], conds: ext['conds'], mem: mem } : 
never : never;