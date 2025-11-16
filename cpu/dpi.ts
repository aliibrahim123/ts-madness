import type { add, sub } from "../math/arith.ts";
import type { Bits, bits, Byte, Dg, n12, n32, n64, Quat, zero } from "../math/format.ts";
import type { and, bitClear, imply, nand, nor, or, xnor, xor } from "../math/logic.ts";
import type { dec2regs, writeReg } from "./common.ts";
import type { Extate, RegNb } from "./index.ts";

export type execDPI <ins extends n32, ext extends Extate> = 
	ins extends [any, infer op0 extends Dg, ...infer regs extends n12, ...infer imd extends n12] ?
	[bits[regs[0]], dec2regs<regs>] extends 
		[infer op1 extends Bits, [infer dst extends RegNb, infer src extends RegNb]] ?
	op1 extends [0, 0, ...any] ? execOp0<ext, op0, dst, ext['regs'][src], imd> :
	

never : never : never;

type execOp0 <ext extends Extate, op0 extends Dg, dst extends RegNb, src extends n64, imd extends n12> =
	op0 extends 0 ? writeReg<ext, dst, and<src, logicImd<imd>>> :
	op0 extends 1 ? writeReg<ext, dst, or<src, logicImd<imd>>> :
	op0 extends 2 ? writeReg<ext, dst, xor<src, logicImd<imd>>> :
	op0 extends 3 ? writeReg<ext, dst, imply<src, logicImd<imd>>> :
	op0 extends 4 ? writeReg<ext, dst, nand<src, logicImd<imd>>> :
	op0 extends 5 ? writeReg<ext, dst, nor<src, logicImd<imd>>> :
	op0 extends 6 ? writeReg<ext, dst, xnor<src, logicImd<imd>>> :
	op0 extends 7 ? writeReg<ext, dst, bitClear<src, logicImd<imd>>> :
	op0 extends 8 ? writeReg<ext, dst, add<src, lowImd<imd>>> :
	op0 extends 9 ? writeReg<ext, dst, sub<src, lowImd<imd>>> :
	op0 extends 10 ? writeReg<ext, dst, sub<lowImd<imd>, src>> :
never;

type lowImd <imd extends n12> = [imd[0], imd[1], imd[2], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
type movImd <imdLow extends n12, imdHig extends Dg, sh extends Quat> = 
	sh extends 0 ? [imdLow[0], imdLow[1], imdLow[2], imdHig, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] :
	sh extends 1 ? [0, 0, 0, 0, imdLow[0], imdLow[1], imdLow[2], imdHig, 0, 0, 0, 0, 0, 0, 0, 0] :
	sh extends 2 ? [0, 0, 0, 0, 0, 0, 0, 0, imdLow[0], imdLow[1], imdLow[2], imdHig, 0, 0, 0, 0] :
	sh extends 3 ? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, imdLow[0], imdLow[1], imdLow[2], imdHig] : 
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
		rot extends 8 ? [val[0], val[1], 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15] :
		rot extends 9 ? [15, 15, val[0], val[1], 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15] :
		rot extends 10 ? [15, 15, 15, 15, val[0], val[1], 15, 15, 15, 15, 15, 15, 15, 15, 15, 15] :
		rot extends 11 ? [15, 15, 15, 15, 15, 15, val[0], val[1], 15, 15, 15, 15, 15, 15, 15, 15] :
		rot extends 12 ? [15, 15, 15, 15, 15, 15, 15, 15, val[0], val[1], 15, 15, 15, 15, 15, 15] :
		rot extends 13 ? [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, val[0], val[1], 15, 15, 15, 15] :
		rot extends 14 ? [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, val[0], val[1], 15, 15] :
		rot extends 15 ? [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, val[0], val[1]] :
	never : never;