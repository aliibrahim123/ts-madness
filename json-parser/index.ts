// simple json parser
// supports every features plus comments
// except number exponents and \u escape sequences

import type { whileMatch } from "../common/string.ts"
import type { prettify } from "../common/utils.ts";

/** pattern of json number */
type nbPattern = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '.' | '-' | '+';
type whitespace = ' ' | '\t' | '\n' | '\r';

type skipWhitespace <src extends string> =
	src extends `${whitespace}${infer rest}` ? skipWhitespace<rest> : src;

/** parse a json value */
type parseValue <src extends string> =
	// keywords
	src extends `true${infer rest}` ? [true, rest] :
	src extends `false${infer rest}` ? [false, rest] :
	src extends `null${infer rest}` ? [null, rest] :
	// comments
	src extends `//${string}\n${infer rest}` ? parseValue<rest> :
	src extends `${infer char}${infer rest}` ?
		// skip whitespace
		char extends ' ' | '\t' | '\n' | '\r' ? parseValue<rest> :
		// number
		char extends nbPattern ? 
			whileMatch<src, nbPattern> extends [`${infer nb extends number}`, infer rest] ? 
			[nb, rest] : never :
		// string
		char extends '"' ? 
			captureStr<rest, ''> extends [infer text extends string, infer rest] ? 
			[parseEscapeSeq<text, ''>, rest] : never :
		// array
		char extends '[' ? parseArray<rest, []> :
		// object
		char extends '{' ? parseObject<rest, {}> :
		never :
	never;

/** capture string, handling quote escape sequences */
type captureStr <src extends string, res extends string> = 
	// there is quote escape sequence
	src extends `${infer text}\\"${infer rest}` ?
		// case the string end before that escape sequence
		text extends `${infer text}"${infer rest2}` ? 
			[`${res}${text}`, `${rest2}\\"${rest}`] :
		// continue capturing
		captureStr<rest, `${res}${text}"`> :
	// else capture till end
	src extends `${infer text}"${infer rest}` ?
		[`${res}${text}`, rest] : never;

/** subtitute escape sequences */
type parseEscapeSeq <src extends string, res extends string> =
	// capture next escape sequence
	src extends `${infer text}\\${infer char}${infer rest}` ? 
		// subtitute it
		char extends '"' ? parseEscapeSeq<rest, `${res}${text}\\"`> :
		char extends '\\' ? parseEscapeSeq<rest, `${res}${text}\\`> :
		char extends '/' ? parseEscapeSeq<rest, `${res}${text}/`> :
		char extends 'b' ? parseEscapeSeq<rest, `${res}${text}\b`> :
		char extends 'n' ? parseEscapeSeq<rest, `${res}${text}\n`> :
		char extends 'r' ? parseEscapeSeq<rest, `${res}${text}\r`> :
		char extends 't' ? parseEscapeSeq<rest, `${res}${text}\t`> :
		char extends 'f' ? parseEscapeSeq<rest, `${res}${text}\f`> :
		never :
	// case no, return
	`${res}${src}`;

type parseArray <src extends string, items extends any[]> = 
	// short circuit for empty array
	skipWhitespace<src> extends `]${infer rest}` ? [items, rest] :
	// parse item
	parseValue<src> extends [infer item, infer rest extends string] ?

	skipWhitespace<rest> extends `${infer char}${infer rest}` ?
		// comma, continue
		char extends ',' ? parseArray<rest, [...items, item]> :
		// right bracket, end
		char extends ']' ? [[...items, item], rest] :
	never : never : never;

type parseObject <src extends string, obj> = 
	// short circuit for empty object
	skipWhitespace<src> extends `}${infer rest}` ? [obj, rest] :
	// parse key
	skipWhitespace<src> extends `"${infer name}"${infer rest}` ?
	// consume ':'
	skipWhitespace<rest> extends `:${infer rest}` ?
	// parse value
	parseValue<rest> extends [infer value, infer rest extends string] ?
	 
	skipWhitespace<rest> extends `${infer char}${infer rest}` ?
		// comma, continue
		char extends ',' ? parseObject<rest, obj & Record<name, value>> :
		// right curley, end
		char extends '}' ? [prettify<obj & Record<name, value>>, rest] :
	never : never : never : never : never;

/** parse json */
export type parse <src extends string> = 
	// parse root value
	parseValue<src> extends [infer value, infer rest extends string] ? 
	// ensure no remaining non whitespace
	skipWhitespace<rest> extends '' ? value : never : never;