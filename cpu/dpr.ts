import type { abs, add, addOp, div, mult, neg, sub, subOp } from "../math/arith.ts";
import type { eq, gt, isNeg, isZero, max, min, ucomp, umax, umin } from "../math/comp.ts";
import type { bit, bits, byte2n64, Dg, n16, n32, n64, one, n12, zero, Bits, n16ToN64, n64ToN16, Byte } from "../math/format.ts";
import type { and, bitClear, clo, cls, clz, countBits, countZeros, cto, ctz, imply, nand, nor, not, or, rev, rev16, rev32, rev8, xnor, xor } from "../math/logic.ts";
import type { funnelShift, rol, sar, shl, shr, signExt16, signExt32, signExt8 } from "../math/shift.ts";
import type { dec2regs, dec3regs, dec4regs, decReg, readCond, write2Regs, writeCond, writeConds, writeReg, writeRegWFlags } from "./common.ts";
import type { Extate, RegNb } from "./index.ts";

export type execDPR <ins extends n32, ext extends Extate> = 
	ins extends [Dg, infer secGrp, ...Dg[]] ?
		secGrp extends 0 ? exec2Src<ins, ext> :
		secGrp extends 1 ? exec1Src<ins, ext> :
		secGrp extends 2 ? exec3Src<ins, ext> :
		secGrp extends 3 ? execOther<ins, ext> :
never : never;

type exec2Src <ins extends n32, ext extends Extate> = 
	ins extends [Dg, Dg, infer op0, infer op1 extends Dg, ...infer regs extends n16] ?
	dec3regs<regs> extends [infer dst extends RegNb, infer src1 extends RegNb, infer src2 extends RegNb] ?
		op0 extends 0 ? exec2SOp0<op1, ext, ext['regs'][src1], ext['regs'][src2], dst> :
		op0 extends 1 ? exec2SOp1<op1, ext, ext['regs'][src1], ext['regs'][src2], dst> :
		op0 extends 2 ? writeReg<ext, dst, 
			readCond<ext, op1, 0> extends 0 ? ext['regs'][src1] : ext['regs'][src2]
		> :
never : never : never;

type exec2SOp0 <op extends Dg, ext extends Extate, src1 extends n64, src2 extends n64, dst extends RegNb> =
	op extends 0 ? writeReg<ext, dst, and<src1, src2>> :
	op extends 1 ? writeReg<ext, dst, or<src1, src2>> :
	op extends 2 ? writeReg<ext, dst, xor<src1, src2>> :
	op extends 3 ? writeReg<ext, dst, imply<src1, src2>> :
	op extends 4 ? writeReg<ext, dst, nand<src1, src2>> :
	op extends 5 ? writeReg<ext, dst, nor<src1, src2>> :
	op extends 6 ? writeReg<ext, dst, xnor<src1, src2>> :
	op extends 7 ? writeReg<ext, dst, bitClear<src1, src2>> :
	op extends 8 ? writeReg<ext, dst, add<src1, src2>> :
	op extends 9 ? writeReg<ext, dst, sub<src1, src2>> :
	op extends 10 ? addOp<src1, src2, bits[ext['conds'][0]][2]> extends 
		[infer carry extends 0 | 1, infer sum extends n64] ?
		writeRegWFlags<ext, dst, sum, [isZero<sum>, isNeg<sum>, carry, 0]> : never :
	op extends 11 ? subOp<src1, src2, bits[ext['conds'][0]][2]> extends 
		[infer carry extends 0 | 1, infer sum extends n64] ?
		writeRegWFlags<ext, dst, sum, [isZero<sum>, isNeg<sum>, carry, 0]> : never :
	op extends 12 ? writeReg<ext, dst, shl<src1, [src2[0], mod4[src2[1]]]>> :
	op extends 13 ? writeReg<ext, dst, shr<src1, [src2[0], mod4[src2[1]]]>> :
	op extends 14 ? writeReg<ext, dst, rol<src1, [src2[0], mod4[src2[1]]]>> :
	op extends 15 ? writeReg<ext, dst, sar<src1, [src2[0], mod4[src2[1]]]>> :
never;

type exec2SOp1 <op extends Dg, ext extends Extate, src1 extends n64, src2 extends n64, dst extends RegNb> =
	op extends 0 ? writeReg<ext, dst, min<src1, src2>> :
	op extends 1 ? writeReg<ext, dst, max<src1, src2>> :
	op extends 2 ? writeReg<ext, dst, umin<src1, src2>> :
	op extends 3 ? writeReg<ext, dst, umax<src1, src2>> :
never;

type exec1Src <ins extends n32, ext extends Extate> = 
	ins extends [Dg, Dg, infer op0, infer op1 extends Dg, infer op2 extends Dg, ...infer regs extends n12] ?
	dec2regs<regs> extends [infer dst extends RegNb, infer src extends RegNb] ?
		op0 extends 0 ? exec1SOp0<op1, ext, ext['regs'][src], dst> :
		op0 extends 1 ? exec1SOp1<op1, op2, ext, ext['regs'][src], dst> :
never : never : never;

type exec1SOp0 <op extends Dg, ext extends Extate, src extends n64, dst extends RegNb> =
	op extends 0  ? writeReg<ext, dst, byte2n64<countBits<src>>> :
	op extends 1  ? writeReg<ext, dst, byte2n64<countZeros<src>>> :
	op extends 2  ? writeReg<ext, dst, abs<src>> :
	op extends 3  ? writeReg<ext, dst, byte2n64<cls<src>>> :
	op extends 4  ? writeReg<ext, dst, byte2n64<ctz<src>>> :
	op extends 5  ? writeReg<ext, dst, byte2n64<cto<src>>> :
	op extends 6  ? writeReg<ext, dst, byte2n64<clz<src>>> :
	op extends 7  ? writeReg<ext, dst, byte2n64<clo<src>>> :
	op extends 8  ? writeReg<ext, dst, rev<src>> :
	op extends 9  ? writeReg<ext, dst, rev8<src>> :
	op extends 10 ? writeReg<ext, dst, rev16<src>> :
	op extends 11 ? writeReg<ext, dst, rev32<src>> :
	op extends 12 ? writeReg<ext, dst, signExt8<src>> :
	op extends 13 ? writeReg<ext, dst, signExt16<src>> :
	op extends 14 ? writeReg<ext, dst, signExt32<src>> :
never;

type exec1SOp1 <op1 extends Dg, op2 extends Dg, ext extends Extate, src extends n64, dst extends RegNb> =
	op1 extends 0 ? writeReg<ext, dst, readCond<ext, op2, 0> extends 0 ? src : add<src, one>> :
	op1 extends 1 ? writeReg<ext, dst, readCond<ext, op2, 1> extends 0 ? src : add<src, one>> :
	op1 extends 2 ? writeReg<ext, dst, readCond<ext, op2, 0> extends 0 ? src : not<src>> :
	op1 extends 3 ? writeReg<ext, dst, readCond<ext, op2, 1> extends 0 ? src : not<src>> :
	op1 extends 4 ? writeReg<ext, dst, readCond<ext, op2, 0> extends 0 ? src : neg<src>> :
	op1 extends 5 ? writeReg<ext, dst, readCond<ext, op2, 1> extends 0 ? src : neg<src>> :
	op1 extends 6 ? writeCond<ext, op2, and<src, ext['regs'][dst]> extends zero ? 1 : 0> :
	op1 extends 7 ? writeCond<ext, op2, and<src, ext['regs'][dst]> extends zero ? 0 : 1> :
	op1 extends 8 ? writeCond<ext, op2, and<src, ext['regs'][dst]> extends src ? 1 : 0> :
	op1 extends 9 ? writeCond<ext, op2, eq<src, ext['regs'][dst]>> :
	op1 extends 10 ? writeCond<ext, op2, eq<src, ext['regs'][dst]> extends 0 ? 1 : 0> :
	op1 extends 11 ? writeCond<ext, op2, gt<src, ext['regs'][dst]>> :
	op1 extends 12 ? writeCond<ext, op2, gt<src, ext['regs'][dst]> extends 0 ? 1 : 0> :
	op1 extends 13 ? writeCond<ext, op2, ucomp<src, ext['regs'][dst]> extends 1 ? 1 : 0> :
	op1 extends 14 ? writeCond<ext, op2, ucomp<src, ext['regs'][dst]> extends 1 ? 0 : 1> :
never;

type exec3Src <ins extends n32, ext extends Extate> = 
	ins extends [Dg, Dg, infer op, ...infer regs extends [...n16, Dg]] ?
	dec4regs<regs> extends 
		[infer dst extends RegNb, infer src1 extends RegNb, infer src2 extends RegNb, infer src3 extends RegNb] ?
	[ext['regs'][src2], ext['regs'][src3]] extends [infer src2 extends n64, infer src3 extends n64] ?
		op extends 0 ? writeReg<ext, dst, add<ext['regs'][src1], mult<src2, src3>[0]>> :
		op extends 1 ? writeReg<ext, dst, sub<ext['regs'][src1], mult<src2, src3>[0]>> :
		op extends 2 ? write2Regs<ext, dst, src1, mult<src2, src3>> :
		op extends 3 ? write2Regs<ext, dst, src1, div<src2, src3>> :
		op extends 4 ? writeReg<ext, dst, add<ext['regs'][src1], add<src2, src3>>> :
		op extends 5 ? writeReg<ext, dst, funnelShift<ext['regs'][src1], src2, [src3[0], mod4[src3[1]]]>> :
never : never : never : never;

type execOther <ins extends n32, ext extends Extate> =
	ins extends [Dg, Dg, infer op0 extends Dg, ...Dg[]] ?
	op0 extends 0 ? 
		ins extends [Dg, Dg, Dg, infer op1 extends Dg, Dg, Dg, ...infer reg extends Byte] ?
		[bits[reg[0]], bits[reg[1]]] extends [infer r0 extends Bits, infer r1 extends Bits] ?
			op1 extends 0 ? writeReg<ext, decReg<[r0[3], ...r1]>, n16ToN64<ext['conds']>> :
			op1 extends 1 ? writeConds<ext, n64ToN16<ext['regs'][decReg<[r0[3], ...r1]>]>> :
		never : never : never :
never : never;
	


export type mod4 = {
	0: 0, 1: 1, 2:  2, 3:  3, 4:  0, 5:  1, 6:  2, 7:  3,
	8: 0, 9: 1, 10: 2, 11: 3, 12: 0, 13: 1, 14: 2, 15: 3
}