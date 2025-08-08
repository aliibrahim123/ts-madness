// compute 2^64 math in hexadicimal
// binary and quaternary are very long
// base 256 is huge for hardcoded tables
// hexadicimal is not so long and is reasonably small in hardcoded tables

import type { toChars, toCharsRev } from "../common/string.ts"

export type Dg = 
	0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15
// little endian
export type Nb = [
	Dg, Dg, Dg, Dg, Dg, Dg, Dg, Dg, 
	Dg, Dg, Dg, Dg, Dg, Dg, Dg, Dg
];

export type dgToStr = {
	0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 
	8: '8', 9: '9', 10: 'a', 11: 'b', 12: 'c', 13: 'd', 14: 'e', 15: 'f'
};
export type strToDg = {
	'0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, 
	'8': 8, '9': 9, 'a': 10, 'b': 11, 'c': 12, 'd': 13, 'e': 14, 'f': 15,
}

export type nbToStr <nb extends Nb> = 
	`${nb[0]}${nb[1]}${nb[2]}${nb[3]}${nb[4]}${nb[5]}${nb[6]}${nb[7]}${
	nb[8]}${nb[9]}${nb[10]}${nb[11]}${nb[12]}${nb[13]}${nb[14]}${nb[15]}`

type pad16 <nb extends Dg[]> = 
	nb['length'] extends 16 ? nb : pad16<[...nb, 0]>

export type strToNb <str extends string> = 
	toCharsRev<str> extends infer chars extends (keyof strToDg)[] ?
	{ [ K in keyof chars ]: strToDg[chars[K]] } extends infer chars extends Dg[] ? 
		chars['length'] extends 0 ?  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]  :
		chars['length'] extends 1 ?  [...chars, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] :
		chars['length'] extends 2 ?  [...chars, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] :
		chars['length'] extends 3 ?  [...chars, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] :
		chars['length'] extends 4 ?  [...chars, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] :
		chars['length'] extends 5 ?  [...chars, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] :
		chars['length'] extends 6 ?  [...chars, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] :
		chars['length'] extends 7 ?  [...chars, 0, 0, 0, 0, 0, 0, 0, 0, 0] :
		chars['length'] extends 8 ?  [...chars, 0, 0, 0, 0, 0, 0, 0, 0] :
		chars['length'] extends 9 ?  [...chars, 0, 0, 0, 0, 0, 0, 0] :
		chars['length'] extends 10 ? [...chars, 0, 0, 0, 0, 0, 0] :
		chars['length'] extends 11 ? [...chars, 0, 0, 0, 0, 0] :
		chars['length'] extends 12 ? [...chars, 0, 0, 0, 0] :
		chars['length'] extends 13 ? [...chars, 0, 0, 0] :
		chars['length'] extends 14 ? [...chars, 0, 0] :
		chars['length'] extends 15 ? [...chars, 0] :
		chars
	: never : never
