import type { Nb, strToNb } from "./format.ts";
import type { andTable } from "./tables/logic.ts";

export type and <a extends Nb, b extends Nb> = 
	{ [k in 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15]: andTable[a[k]][b[k]] }

type a = and<strToNb<'12'>, strToNb<'12'>>
type b = strToNb<'123'>