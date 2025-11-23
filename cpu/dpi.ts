import type { satisfies } from "../common/utils.ts";
import type { add, sub } from "../math/arith.ts";
import type { eq, gt, lt } from "../math/comp.ts";
import type { Bits, bits, bits2dg, Byte, Dg, dgTou2u2, n12, n16, n32, n64, Quat, u2u4_u6, zero } from "../math/format.ts";
import type { and, and16, bitClear, imply, nand, nor, not, or, redXor16, xnor, xor, xor16 } from "../math/logic.ts";
import type { bfieldExtract, bfieldInsert, rol, sar, shl, shr } from "../math/shift.ts";
import type { dec2regs, decReg, writeCond, writeReg } from "./common.ts";
import type { Extate, RegNb } from "./index.ts";

export type execDPI <ins extends n32, ext extends Extate> = 
	ins extends [Dg, infer op0 extends Dg, infer op1 extends Dg, ...Dg[]] ?
		op0 extends 0 | 1 | 2 | 3 | 4 ? exec12Imd<ins, ext> : 
		op0 extends 6 ? execMov<ins, ext> :
		op0 extends 7 ? execOp7<ins, ext> :
	never : never;

type exec12Imd <ins extends n32, ext extends Extate> =
	ins extends [Dg, infer op0 extends Dg, ...infer regs extends n12, ...infer imd extends n12] ?
	[bits[regs[0]], dec2regs<regs>] extends 
		[infer op1 extends Bits, [infer dst extends RegNb, infer src extends RegNb]] ?
	ext['regs'][src] extends infer src extends n64 ?
		op0 extends 0 ?
			op1 extends [0, 0] ? writeReg<ext, dst, and<src, logicImd<imd>>> :
			op1 extends [1, 0] ? writeReg<ext, dst, or<src, logicImd<imd>>> :
			op1 extends [0, 1] ? writeReg<ext, dst, xor<src, logicImd<imd>>> :
			op1 extends [1, 1] ? writeReg<ext, dst, imply<src, logicImd<imd>>> :
			never :
		op0 extends 1 ?
			op1 extends [0, 0] ? writeReg<ext, dst, nand<src, logicImd<imd>>> :
			op1 extends [1, 0] ? writeReg<ext, dst, nor<src, logicImd<imd>>> :
			op1 extends [0, 1] ? writeReg<ext, dst, xnor<src, logicImd<imd>>> :
			op1 extends [1, 1] ? writeReg<ext, dst, bitClear<src, logicImd<imd>>> :
			never :
		op0 extends 2 ?
			op1 extends [0, 0] ? writeReg<ext, dst, add<src, lowImd<imd>>> :
			op1 extends [1, 0] ? writeReg<ext, dst, sub<src, lowImd<imd>>> :
			op1 extends [0, 1] ? writeReg<ext, dst, sub<lowImd<imd>, src>> :
			never :
		op0 extends 3 ?
			bfieldImd<imd> extends [infer offset extends Byte, infer width extends Byte] ?
			op1 extends [0, 0] ? writeReg<ext, dst, bfieldExtract<src, offset, width>> :
			op1 extends [1, 0] ? writeReg<ext, dst, bfieldInsert<src, ext['regs'][dst], offset, width>> :
			never : never :
		op0 extends 4 ?
			op1 extends [0, 0] ? writeCond<ext, satisfies<dst, Dg>, eq<src, lowImd<imd>>> :
			op1 extends [1, 0] ? writeCond<ext, satisfies<dst, Dg>, eq<src, lowImd<imd>> extends 1 ? 0 : 1> :
			op1 extends [0, 1] ? writeCond<ext, satisfies<dst, Dg>, gt<src, lowImd<imd>>> :
			op1 extends [1, 1] ? writeCond<ext, satisfies<dst, Dg>, lt<src, lowImd<imd>>> :
			never :
	never : never : never : never;

type execMov <ins extends n32, ext extends Extate> =
	ins extends [Dg, Dg, infer op extends Dg, infer dst extends Dg,...infer imd extends n16] ?
	[bits[op], bits[dst]] extends [infer op extends Bits, infer dst extends Bits] ?
	decReg<[op[3], ...dst]> extends infer dst extends RegNb ?
	writeReg<ext, dst, 
		op[0] extends 0 ? movImd<imd, [op[1], op[2]]> :
		or<movImd<imd, [op[2], op[1]]>, and<ext['regs'][dst], not<movImd<[15, 15, 15, 15], [op[1], op[2]]>>>>
	> :
never : never : never;

type execShift <ins extends n32, ext extends Extate> =
	ins extends [Dg, Dg, Dg, infer op extends Dg, infer shlow extends Dg, ...infer regs extends n12] ?
	[dgTou2u2[regs[0]], dec2regs<regs>] extends 
	[[infer shhi extends Quat, Dg], [infer dst extends RegNb, infer src extends RegNb]] ?
		op extends 0 ? writeReg<ext, dst, shl<ext['regs'][src], [shlow, shhi]>> :
		op extends 1 ? writeReg<ext, dst, shr<ext['regs'][src], [shlow, shhi]>> :
		op extends 2 ? writeReg<ext, dst, rol<ext['regs'][src], [shlow, shhi]>> :
		op extends 3 ? writeReg<ext, dst, sar<ext['regs'][src], [shlow, shhi]>> :
	never : never : never;
	
type execOp7 <ins extends n32, ext extends Extate> =
	ins extends [Dg, Dg, infer op extends 0 | 1 | 2 | 3, infer dst extends Dg, ...infer mask extends n16] ?
		op extends 0 ? writeCond<ext, dst, and16<ext['conds'], mask> extends zero ? 1 : 0> :
		op extends 1 ? writeCond<ext, dst, and16<ext['conds'], mask> extends zero ? 0 : 1> :
		op extends 2 ? writeCond<ext, dst, and16<ext['conds'], mask> extends mask ? 1 : 0> :
		op extends 3 ? writeCond<ext, dst, redXor16<and16<ext['conds'], mask>> extends 1 ? 1 : 0> :
		never :
	ins extends [Dg, Dg, 4, infer op extends Dg, infer mask extends n16] ?
		op extends 0 ? { 
			pc: ext['pc'], regs: ext['regs'], mem: ext['mem'], conds: xor16<ext['conds'], mask> 
		} :
		never : 
	ins extends [Dg, Dg, 5, infer op extends Dg, infer shlow extends Dg, ...infer regs extends n12] ?
		[dgTou2u2[regs[0]], dec2regs<regs>] extends 
			[[infer shhi extends Quat, Dg], [infer dst extends RegNb, infer src extends RegNb]] ?
		op extends 0 ? writeReg<ext, dst, shl<ext['regs'][src], [shlow, shhi]>> :
		op extends 1 ? writeReg<ext, dst, shr<ext['regs'][src], [shlow, shhi]>> :
		op extends 2 ? writeReg<ext, dst, rol<ext['regs'][src], [shlow, shhi]>> :
		op extends 3 ? writeReg<ext, dst, sar<ext['regs'][src], [shlow, shhi]>> :
		never : never :
never;

export type lowImd <imd extends n12> = [imd[0], imd[1], imd[2], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
type movImd <imd extends n16, sh extends [0 | 1, 0 | 1]> = 
	sh extends [0, 0] ? [...imd, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] :
	sh extends [1, 0] ? [0, 0, 0, 0, ...imd, 0, 0, 0, 0, 0, 0, 0, 0] :
	sh extends [0, 1] ? [0, 0, 0, 0, 0, 0, 0, 0, ...imd, 0, 0, 0, 0] :
	sh extends [1, 1] ? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ...imd] : 
never;
type logicImd <imd extends n12> = 
	imd extends [infer rot extends Dg, ...infer val extends Byte] ?
		rot extends 0 ? [val[0], val[1], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] :
		rot extends 1 ? [0, 0, val[0], val[1], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] :
		rot extends 2 ? [0, 0, 0, 0, val[0], val[1], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] :
		rot extends 3 ? [0, 0, 0, 0, 0, 0, val[0], val[1], 0, 0, 0, 0, 0, 0, 0, 0] :
		rot extends 4 ? [0, 0, 0, 0, 0, 0, 0, 0, val[0], val[1], 0, 0, 0, 0, 0, 0] :
		rot extends 5 ? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, val[0], val[1], 0, 0, 0, 0] :
		rot extends 6 ? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, val[0], val[1], 0, 0] :
		rot extends 7 ? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, val[0], val[1]] :
		rot extends 8 ?  [val[0], val[1], 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15] :
		rot extends 9 ?  [15, 15, val[0], val[1], 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15] :
		rot extends 10 ? [15, 15, 15, 15, val[0], val[1], 15, 15, 15, 15, 15, 15, 15, 15, 15, 15] :
		rot extends 11 ? [15, 15, 15, 15, 15, 15, val[0], val[1], 15, 15, 15, 15, 15, 15, 15, 15] :
		rot extends 12 ? [15, 15, 15, 15, 15, 15, 15, 15, val[0], val[1], 15, 15, 15, 15, 15, 15] :
		rot extends 13 ? [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, val[0], val[1], 15, 15, 15, 15] :
		rot extends 14 ? [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, val[0], val[1], 15, 15] :
		rot extends 15 ? [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, val[0], val[1]] :
	never : never;
type bfieldImd <imd extends n12> = 
	dgTou2u2[imd[1]] extends [infer imd1l extends Quat, infer imd1h extends Quat] ?
	[[imd[0], imd1l], u2u4_u6<[imd1h, imd[2]]>] :
never;