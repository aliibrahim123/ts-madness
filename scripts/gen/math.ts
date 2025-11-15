import { writeFile } from "node:fs/promises";
import { row, table } from "./table.ts";

const chunks = [''];

chunks.push(`/** a: dg, b: dg => a & b */ export type and = ${table(16, 16, (x, y) => x & y)};\n`);
chunks.push(`/** a: dg, b: dg => a | b */ export type or = ${table(16, 16, (x, y) => x | y)};\n`);
chunks.push(`/** a: dg, b: dg => a ^ b */ export type xor = ${table(16, 16, (x, y) => x ^ y)};\n`);

chunks.push(`/** carry: bit, a: dg, b: dg => [sum: dg, carry: bit] */ export type add = {0: ${
	table(16, 16, (x, y) => `[${(x + y) % 16}, ${(x + y > 15 ? 1 : 0)}]`)
}, 1: ${
	table(16, 16, (x, y) => `[${(x + y + 1) % 16}, ${(x + y + 1 > 15 ? 1 : 0)}]`)
}};\n`);

chunks.push(`/** amount: quat, nb: dg, fill: dg => high_dg([nb, fill] << 4) */ export type shift = {0: ${
	table(16, 16, (x, y) => y)}, 1: ${
	table(16, 16, (x, y) => (y << 1 | x >> 3) % 16)}, 2: ${
	table(16, 16, (x, y) => (y << 2 | x >> 2) % 16)}, 3: ${
	table(16, 16, (x, y) => (y << 3 | x >> 1) % 16)
}};\n`);

writeFile('./math/tables.ts', chunks.join(''));