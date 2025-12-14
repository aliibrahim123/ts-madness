import type { Bits, bits, bits2dg, Byte, Dg, dgTou2u2, n12, n16, Quat, quat2bits, u2u2ToDg, u6_u4u2 } from "../math/format.ts"
import type { RegNb } from "./index.ts"

type u5Tob5 = {
	0:  [0, 0, 0, 0, 0], 1:  [0, 0, 0, 0, 1], 2:  [0, 0, 0, 1, 0], 3:  [0, 0, 0, 1, 1],
	4:  [0, 0, 1, 0, 0], 5:  [0, 0, 1, 0, 1], 6:  [0, 0, 1, 1, 0], 7:  [0, 0, 1, 1, 1],
	8:  [0, 1, 0, 0, 0], 9:  [0, 1, 0, 0, 1], 10: [0, 1, 0, 1, 0], 11: [0, 1, 0, 1, 1],
	12: [0, 1, 1, 0, 0], 13: [0, 1, 1, 0, 1], 14: [0, 1, 1, 1, 0], 15: [0, 1, 1, 1, 1],
	16: [1, 0, 0, 0, 0], 17: [1, 0, 0, 0, 1], 18: [1, 0, 0, 1, 0], 19: [1, 0, 0, 1, 1],
	20: [1, 0, 1, 0, 0], 21: [1, 0, 1, 0, 1], 22: [1, 0, 1, 1, 0], 23: [1, 0, 1, 1, 1],
	24: [1, 1, 0, 0, 0], 25: [1, 1, 0, 0, 1], 26: [1, 1, 0, 1, 0], 27: [1, 1, 0, 1, 1],
	28: [1, 1, 1, 0, 0], 29: [1, 1, 1, 0, 1], 30: [1, 1, 1, 1, 0], 31: [1, 1, 1, 1, 1]
} 

type b5 = [0 | 1, 0 | 1, 0 | 1, 0 | 1, 0 | 1];
type enc3Reg <reg1 extends RegNb, reg2 extends RegNb, reg3 extends RegNb> = 
	[u5Tob5[reg1], u5Tob5[reg2], u5Tob5[reg3]] extends 
		[infer reg1 extends b5, infer reg2 extends b5, infer reg3 extends b5] ?
	[
		bits2dg<[0,       reg1[0], reg1[1], reg1[2]]>, bits2dg<[reg1[3], reg1[4], reg2[0], reg2[1]]>, 
		bits2dg<[reg2[2], reg2[3], reg2[4], reg3[0]]>, bits2dg<[reg3[1], reg3[2], reg3[3], reg3[4]]>
	] :
never;

type enc2Reg <pre extends [0|1, 0|1], reg1 extends RegNb, reg2 extends RegNb> = 
	[u5Tob5[reg1], u5Tob5[reg2]] extends [infer reg1 extends b5, infer reg2 extends b5] ?
	[
		bits2dg<[...pre, reg1[0], reg1[1]]>, bits2dg<[reg1[2], reg1[3], reg1[4], reg2[0]]>, 
		bits2dg<[reg2[1], reg2[2], reg2[3], reg2[4]]>
	] :
never;

type enc4Reg <reg1 extends RegNb, reg2 extends RegNb, reg3 extends RegNb, reg4 extends RegNb> =
	[u5Tob5[reg1], u5Tob5[reg2], u5Tob5[reg3], u5Tob5[reg4]] extends 
		[infer reg1 extends b5, infer reg2 extends b5, infer reg3 extends b5, infer reg4 extends b5] ?
	[
		bits2dg<[reg1[0], reg1[1], reg1[2], reg1[3]]>, bits2dg<[reg1[4], reg2[0], reg2[1], reg2[2]]>, 
		bits2dg<[reg2[3], reg2[4], reg3[0], reg3[1]]>, bits2dg<[reg3[2], reg3[3], reg3[4], reg4[0]]>, 
		bits2dg<[reg4[1], reg4[2], reg4[3], reg4[4]]>
	] :
never;

type enc1Reg <pre extends [0|1, 0|1, 0|1], reg extends RegNb> = 
	u5Tob5[reg] extends infer reg extends b5 ?
	[bits2dg<[...pre, reg[0]]>, bits2dg<[reg[1], reg[2], reg[3], reg[4]]>] :
never;

export type and <dst extends RegNb, src1 extends RegNb, src2 extends RegNb> =
	[0, 0, 0, 0, ...enc3Reg<dst, src1, src2>];
export type or <dst extends RegNb, src1 extends RegNb, src2 extends RegNb> =
	[0, 0, 0, 1, ...enc3Reg<dst, src1, src2>];
export type xor <dst extends RegNb, src1 extends RegNb, src2 extends RegNb> =
	[0, 0, 0, 2, ...enc3Reg<dst, src1, src2>];
export type imply <dst extends RegNb, src1 extends RegNb, src2 extends RegNb> =
	[0, 0, 0, 3, ...enc3Reg<dst, src1, src2>];
export type nand <dst extends RegNb, src1 extends RegNb, src2 extends RegNb> =
	[0, 0, 0, 4, ...enc3Reg<dst, src1, src2>];
export type nor <dst extends RegNb, src1 extends RegNb, src2 extends RegNb> =
	[0, 0, 0, 5, ...enc3Reg<dst, src1, src2>];
export type xnor <dst extends RegNb, src1 extends RegNb, src2 extends RegNb> =
	[0, 0, 0, 6, ...enc3Reg<dst, src1, src2>];
export type bcr <dst extends RegNb, src1 extends RegNb, src2 extends RegNb> =
	[0, 0, 0, 7, ...enc3Reg<dst, src1, src2>];
export type add <dst extends RegNb, src1 extends RegNb, src2 extends RegNb> =
	[0, 0, 0, 8, ...enc3Reg<dst, src1, src2>];
export type sub <dst extends RegNb, src1 extends RegNb, src2 extends RegNb> =
	[0, 0, 0, 9, ...enc3Reg<dst, src1, src2>];
export type addc <dst extends RegNb, src1 extends RegNb, src2 extends RegNb> =
	[0, 0, 0, 10, ...enc3Reg<dst, src1, src2>];
export type subc <dst extends RegNb, src1 extends RegNb, src2 extends RegNb> =
	[0, 0, 0, 11, ...enc3Reg<dst, src1, src2>];
export type shl <dst extends RegNb, src1 extends RegNb, src2 extends RegNb> =
	[0, 0, 0, 12, ...enc3Reg<dst, src1, src2>];
export type shr <dst extends RegNb, src1 extends RegNb, src2 extends RegNb> =
	[0, 0, 0, 13, ...enc3Reg<dst, src1, src2>];
export type sar <dst extends RegNb, src1 extends RegNb, src2 extends RegNb> =
	[0, 0, 0, 14, ...enc3Reg<dst, src1, src2>];
export type rol <dst extends RegNb, src1 extends RegNb, src2 extends RegNb> =
	[0, 0, 0, 15, ...enc3Reg<dst, src1, src2>];

export type max <dst extends RegNb, src1 extends RegNb, src2 extends RegNb> =
	[0, 0, 1, 0, ...enc3Reg<dst, src1, src2>];
export type min <dst extends RegNb, src1 extends RegNb, src2 extends RegNb> =
	[0, 0, 1, 1, ...enc3Reg<dst, src1, src2>];
export type umin <dst extends RegNb, src1 extends RegNb, src2 extends RegNb> =
	[0, 0, 1, 2, ...enc3Reg<dst, src1, src2>];
export type umax <dst extends RegNb, src1 extends RegNb, src2 extends RegNb> =
	[0, 0, 1, 3, ...enc3Reg<dst, src1, src2>];

export type csel <cond extends Dg, dst extends RegNb, src1 extends RegNb, src2 extends RegNb> =
	[0, 0, 2, cond, ...enc3Reg<dst, src1, src2>];

export type cnb <dst extends RegNb, src extends RegNb> =
	[0, 1, 0, 0, 0, ...enc2Reg<[0, 0], dst, src>];
export type cnz <dst extends RegNb, src extends RegNb> =
	[0, 1, 0, 1, 0, ...enc2Reg<[0, 0], dst, src>];
export type abs <dst extends RegNb, src extends RegNb> =
	[0, 1, 0, 2, 0, ...enc2Reg<[0, 0], dst, src>];
export type cls <dst extends RegNb, src extends RegNb> =
	[0, 1, 0, 3, 0, ...enc2Reg<[0, 0], dst, src>];
export type ctz <dst extends RegNb, src extends RegNb> =
	[0, 1, 0, 4, 0, ...enc2Reg<[0, 0], dst, src>];
export type cto <dst extends RegNb, src extends RegNb> =
	[0, 1, 0, 5, 0, ...enc2Reg<[0, 0], dst, src>];
export type clz <dst extends RegNb, src extends RegNb> =
	[0, 1, 0, 6, 0, ...enc2Reg<[0, 0], dst, src>];
export type clo <dst extends RegNb, src extends RegNb> =
	[0, 1, 0, 7, 0, ...enc2Reg<[0, 0], dst, src>];
export type rev <dst extends RegNb, src extends RegNb> =
	[0, 1, 0, 8, 0, ...enc2Reg<[0, 0], dst, src>];
export type rev8 <dst extends RegNb, src extends RegNb> =
	[0, 1, 0, 9, 0, ...enc2Reg<[0, 0], dst, src>];
export type rev16 <dst extends RegNb, src extends RegNb> =
	[0, 1, 0, 10, 0, ...enc2Reg<[0, 0], dst, src>];
export type rev32 <dst extends RegNb, src extends RegNb> =
	[0, 1, 0, 11, 0, ...enc2Reg<[0, 0], dst, src>];
export type se8 <dst extends RegNb, src extends RegNb> =
	[0, 1, 0, 12, 0, ...enc2Reg<[0, 0], dst, src>];
export type se16 <dst extends RegNb, src extends RegNb> =
	[0, 1, 0, 13, 0, ...enc2Reg<[0, 0], dst, src>];
export type se32 <dst extends RegNb, src extends RegNb> =
	[0, 1, 0, 14, 0, ...enc2Reg<[0, 0], dst, src>];

export type cinc <cond extends Dg, dst extends RegNb, src extends RegNb> =
	[0, 1, 1, 0, cond, ...enc2Reg<[0, 0], dst, src>];
export type cinc_n <cond extends Dg, dst extends RegNb, src extends RegNb> =
	[0, 1, 1, 1, cond, ...enc2Reg<[0, 0], dst, src>];
export type cnot <cond extends Dg, dst extends RegNb, src extends RegNb> =
	[0, 1, 1, 2, cond, ...enc2Reg<[0, 0], dst, src>];
export type cnot_n <cond extends Dg, dst extends RegNb, src extends RegNb> =
	[0, 1, 1, 3, cond, ...enc2Reg<[0, 0], dst, src>];
export type cneg <cond extends Dg, dst extends RegNb, src extends RegNb> =
	[0, 1, 1, 4, cond, ...enc2Reg<[0, 0], dst, src>];
export type cneg_n <cond extends Dg, dst extends RegNb, src extends RegNb> =
	[0, 1, 1, 5, cond, ...enc2Reg<[0, 0], dst, src>];
export type noner <cond extends Dg, src1 extends RegNb, src2 extends RegNb> =
	[0, 1, 1, 6, cond, ...enc2Reg<[0, 0], src1, src2>];
export type anyr <cond extends Dg, src1 extends RegNb, src2 extends RegNb> =
	[0, 1, 1, 7, cond, ...enc2Reg<[0, 0], src1, src2>];
export type allr <cond extends Dg, src1 extends RegNb, src2 extends RegNb> =
	[0, 1, 1, 8, cond, ...enc2Reg<[0, 0], src1, src2>];
export type comp_eq <cond extends Dg, src1 extends RegNb, src2 extends RegNb> =
	[0, 1, 1, 10, cond, ...enc2Reg<[0, 0], src1, src2>];
export type comp_ne <cond extends Dg, src1 extends RegNb, src2 extends RegNb> =
	[0, 1, 1, 11, cond, ...enc2Reg<[0, 0], src1, src2>];
export type comp_gt <cond extends Dg, src1 extends RegNb, src2 extends RegNb> =
	[0, 1, 1, 12, cond, ...enc2Reg<[0, 0], src1, src2>];
export type comp_le <cond extends Dg, src1 extends RegNb, src2 extends RegNb> =
	[0, 1, 1, 13, cond, ...enc2Reg<[0, 0], src1, src2>];
export type ucomp_gt <cond extends Dg, src1 extends RegNb, src2 extends RegNb> =
	[0, 1, 1, 14, cond, ...enc2Reg<[0, 0], src1, src2>];
export type ucomp_le <cond extends Dg, src1 extends RegNb, src2 extends RegNb> =
	[0, 1, 1, 15, cond, ...enc2Reg<[0, 0], src1, src2>];

export type madd <dst extends RegNb, src1 extends RegNb, src2 extends RegNb, src3 extends RegNb> =
	[0, 2, 0, ...enc4Reg<dst, src1, src2, src3>];
export type msub <dst extends RegNb, src1 extends RegNb, src2 extends RegNb, src3 extends RegNb> =
	[0, 2, 1, ...enc4Reg<dst, src1, src2, src3>];
export type mulf <dst1 extends RegNb, dst2 extends RegNb, src1 extends RegNb, src2 extends RegNb> =
	[0, 2, 2, ...enc4Reg<dst1, dst2, src1, src2>];
export type divf <dst1 extends RegNb, dst2 extends RegNb, src1 extends RegNb, src2 extends RegNb> =
	[0, 2, 3, ...enc4Reg<dst1, dst2, src1, src2>];
export type add3 <dst extends RegNb, src1 extends RegNb, src2 extends RegNb, src3 extends RegNb> =
	[0, 2, 4, ...enc4Reg<dst, src1, src2, src3>];
export type fush <dst extends RegNb, src1 extends RegNb, src2 extends RegNb, src3 extends RegNb> =
	[0, 2, 5, ...enc4Reg<dst, src1, src2, src3>];

export type mov_conds <op extends 'from' | 'to', reg extends RegNb> =
	op extends 'to' ? [0, 3, 0, 0, 0, 0, ...enc1Reg<[0, 0, 0], reg>] :
	[0, 3, 0, 1, 0, 0, ...enc1Reg<[0, 0, 0], reg>];

export type and_imd <dst extends RegNb, src1 extends RegNb, src2 extends n12> = 
	[1, 0, ...enc2Reg<[0, 0], dst, src1>, ...src2];
export type or_imd <dst extends RegNb, src1 extends RegNb, src2 extends n12> = 
	[1, 0, ...enc2Reg<[1, 0], dst, src1>, ...src2];
export type xor_imd <dst extends RegNb, src1 extends RegNb, src2 extends n12> = 
	[1, 0, ...enc2Reg<[0, 1], dst, src1>, ...src2];
export type imply_imd <dst extends RegNb, src1 extends RegNb, src2 extends n12> = 
	[1, 0, ...enc2Reg<[1, 1], dst, src1>, ...src2];
export type nand_imd <dst extends RegNb, src1 extends RegNb, src2 extends n12> = 
	[1, 1, ...enc2Reg<[0, 0], dst, src1>, ...src2];
export type nor_imd <dst extends RegNb, src1 extends RegNb, src2 extends n12> = 
	[1, 1, ...enc2Reg<[1, 0], dst, src1>, ...src2];
export type xnor_imd <dst extends RegNb, src1 extends RegNb, src2 extends n12> = 
	[1, 1, ...enc2Reg<[0, 1], dst, src1>, ...src2];
export type bcr_imd <dst extends RegNb, src1 extends RegNb, src2 extends n12> = 
	[1, 1, ...enc2Reg<[1, 1], dst, src1>, ...src2];
export type add_imd <dst extends RegNb, src1 extends RegNb, src2 extends n12> = 
	[1, 2, ...enc2Reg<[0, 0], dst, src1>, ...src2];
export type sub_imd <dst extends RegNb, src1 extends RegNb, src2 extends n12> = 
	[1, 2, ...enc2Reg<[1, 0], dst, src1>, ...src2];
export type rsb_imd <dst extends RegNb, src1 extends RegNb, src2 extends n12> = 
	[1, 2, ...enc2Reg<[0, 1], dst, src1>, ...src2];
export type comp_eq_imd <cond extends Dg, src1 extends RegNb, src2 extends n12> = 
	[1, 3, ...enc2Reg<[0, 0], cond, src1>, ...src2];
export type comp_ne_imd <cond extends Dg, src1 extends RegNb, src2 extends n12> = 
	[1, 3, ...enc2Reg<[1, 0], cond, src1>, ...src2];
export type comp_gt_imd <cond extends Dg, src1 extends RegNb, src2 extends n12> = 
	[1, 3, ...enc2Reg<[0, 1], cond, src1>, ...src2];
export type comp_lt_imd <cond extends Dg, src1 extends RegNb, src2 extends n12> = 
	[1, 3, ...enc2Reg<[1, 1], cond, src1>, ...src2];

export type bext <dst extends RegNb, src extends RegNb, offset extends Byte, width extends Byte> = 
	offset extends [infer o0 extends Dg, infer o1 extends Quat] ?
	u6_u4u2<width> extends [infer w0 extends Quat, infer w1 extends Dg] ?
	[1, 4, ...enc2Reg<[0, 0], dst, src>, o0, u2u2ToDg<[o1, w0]>, w1] :
never : never;

export type bins <dst extends RegNb, src extends RegNb, offset extends Byte, width extends Byte> = 
	offset extends [infer o0 extends Dg, infer o1 extends Quat] ?
	u6_u4u2<width> extends [infer w0 extends Quat, infer w1 extends Dg] ?
	[1, 4, ...enc2Reg<[1, 0], dst, src>, o0, u2u2ToDg<[o1, w0]>, w1] :
never : never;

export type mov_imd <dst extends RegNb, imd extends n16, sh extends Quat = 0> = 
	[1, 6, ...enc1Reg<[0, quat2bits[sh][0], quat2bits[sh][1]], dst>, ...imd];
export type movk_imd <dst extends RegNb, imd extends n16, sh extends Quat = 0> = 
	[1, 6, ...enc1Reg<[1, quat2bits[sh][0], quat2bits[sh][1]], dst>, ...imd];

export type none <cond extends Dg, mask extends n16> = 
	[1, 7, 0, cond, ...mask];
export type any_ <cond extends Dg, mask extends n16> = 
	[1, 7, 1, cond, ...mask];
export type all <cond extends Dg, mask extends n16> = 
	[1, 7, 2, cond, ...mask];
export type only <cond extends Dg, mask extends n16> = 
	[1, 7, 3, cond, ...mask];
export type ncond <mask extends n16> = 
	[1, 7, 4, 0, ...mask];

export type shl_imd <dst extends RegNb, src extends RegNb, sh extends Byte> = 
	bits[sh[1]] extends infer sh1 extends Bits ?
	[1, 8, 0, 0, sh[0], ...enc2Reg<[sh1[0], sh1[1]], dst, src>] :
never;
export type shr_imd <dst extends RegNb, src extends RegNb, sh extends Byte> = 
	bits[sh[1]] extends infer sh1 extends Bits ?
	[1, 8, 0, 1, sh[0], ...enc2Reg<[sh1[0], sh1[1]], dst, src>] :
never;
export type rol_imd <dst extends RegNb, src extends RegNb, sh extends Byte> = 
	bits[sh[1]] extends infer sh1 extends Bits ?
	[1, 8, 0, 2, sh[0], ...enc2Reg<[sh1[0], sh1[1]], dst, src>] :
never;
export type sar_imd <dst extends RegNb, src extends RegNb, sh extends Byte> = 
	bits[sh[1]] extends infer sh1 extends Bits ?
	[1, 8, 0, 3, sh[0], ...enc2Reg<[sh1[0], sh1[1]], dst, src>] :
never;

export type ldr_index <dst extends RegNb, base extends RegNb, index extends RegNb> = 
	[2, 0, ...enc3Reg<dst, base, index>, 0, 0]
export type ldr_offset <dst extends RegNb, base extends RegNb, offset extends n12> = 
	[2, 0, ...enc2Reg<[1, 0], dst, base>, ...offset]
export type ldr_32_index <dst extends RegNb, base extends RegNb, index extends RegNb> =
	[2, 1, ...enc3Reg<dst, base, index>, 0, 0];
export type ldr_32_offset <dst extends RegNb, base extends RegNb, offset extends n12> =
	[2, 1, ...enc2Reg<[1, 0], dst, base>, ...offset];
export type ldr_16_index <dst extends RegNb, base extends RegNb, index extends RegNb> =
	[2, 2, ...enc3Reg<dst, base, index>, 0, 0];
export type ldr_16_offset <dst extends RegNb, base extends RegNb, offset extends n12> =
	[2, 2, ...enc2Reg<[1, 0], dst, base>, ...offset];
export type ldr_8_index <dst extends RegNb, base extends RegNb, index extends RegNb> =
	[2, 3, ...enc3Reg<dst, base, index>, 0, 0];
export type ldr_8_offset <dst extends RegNb, base extends RegNb, offset extends n12> =
	[2, 3, ...enc2Reg<[1, 0], dst, base>, ...offset];
export type ldr_s32_index <dst extends RegNb, base extends RegNb, index extends RegNb> =
	[2, 5, ...enc3Reg<dst, base, index>, 0, 0];
export type ldr_s32_offset <dst extends RegNb, base extends RegNb, offset extends n12> =
	[2, 5, ...enc2Reg<[1, 0], dst, base>, ...offset];
export type ldr_s16_index <dst extends RegNb, base extends RegNb, index extends RegNb> =
	[2, 6, ...enc3Reg<dst, base, index>, 0, 0];
export type ldr_s16_offset <dst extends RegNb, base extends RegNb, offset extends n12> =
	[2, 6, ...enc2Reg<[1, 0], dst, base>, ...offset];
export type ldr_s8_index <dst extends RegNb, base extends RegNb, index extends RegNb> =
	[2, 7, ...enc3Reg<dst, base, index>, 0, 0];
export type ldr_s8_offset <dst extends RegNb, base extends RegNb, offset extends n12> =
	[2, 7, ...enc2Reg<[1, 0], dst, base>, ...offset];
export type str_index <src extends RegNb, base extends RegNb, index extends RegNb> =
	[2, 8, ...enc3Reg<src, base, index>, 0, 0];
export type str_offset <src extends RegNb, base extends RegNb, offset extends n12> =
	[2, 8, ...enc2Reg<[1, 0], src, base>, ...offset];
export type str_32_index <src extends RegNb, base extends RegNb, index extends RegNb> =
	[2, 9, ...enc3Reg<src, base, index>, 0, 0];
export type str_32_offset <src extends RegNb, base extends RegNb, offset extends n12> =
	[2, 9, ...enc2Reg<[1, 0], src, base>, ...offset];
export type str_16_index <src extends RegNb, base extends RegNb, index extends RegNb> =
	[2, 10, ...enc3Reg<src, base, index>, 0, 0];
export type str_16_offset <src extends RegNb, base extends RegNb, offset extends n12> =
	[2, 10, ...enc2Reg<[1, 0], src, base>, ...offset];
export type str_8_index <src extends RegNb, base extends RegNb, index extends RegNb> =
	[2, 11, ...enc3Reg<src, base, index>, 0, 0];
export type str_8_offset <src extends RegNb, base extends RegNb, offset extends n12> =
	[2, 11, ...enc2Reg<[1, 0], src, base>, ...offset];

export type jpl_imd <link extends RegNb, address extends n16> = 
	[3, 0, ...enc1Reg<[0, 0, 0], link>, ...address];
export type jpl <link extends RegNb, address extends RegNb> = 
	[3, 0, 2, 0, 0, ...enc2Reg<[0, 0], link, address>];
export type br_imd <cond extends Dg, address extends n16> = 
	[3, 0, 4, cond, ...address];
export type br_n_imd <cond extends Dg, address extends n16> = 
	[3, 0, 5, cond, ...address];
export type br <cond extends Dg, address extends RegNb> = 
	[3, 0, 6, cond, 0, 0, ...enc1Reg<[0, 0, 0], address>];
export type br_n <cond extends Dg, address extends RegNb> = 
	[3, 0, 7, cond, 0, 0, ...enc1Reg<[0, 0, 0], address>];