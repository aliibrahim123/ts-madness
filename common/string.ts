/** remove prefix */
export type rmPrefix<str extends string, pat extends string> = str extends `${pat}${infer rest}` ? rest : str;
/** remove suffix */
export type rmSuffix<str extends string, pat extends string> = str extends `${infer rest}${pat}` ? rest : str;

/** check if string starts with a prefix */
export type hasPrefix<str extends string, pat extends string> = str extends `${pat}${string}` ? true : false;
/** check if string ends with a suffix */
export type hasSuffix<str extends string, pat extends string> = str extends `${string}${pat}` ? true : false;

/** convert string to array of chars */
export type toChars<str extends string> =
	str extends `${infer char}${infer rest}` ? [char, ...toChars<rest>] : [];
/** convert string to array of chars, reversed */
export type toCharsRev<str extends string> =
	str extends `${infer char}${infer rest}` ? [...toCharsRev<rest>, char] : [];

/** first character of a string */
export type firstChar<str extends string> = str extends `${infer char}${string}` ? char : never;

/** split string until pattern is not matched */
export type whileMatch<str extends string, pat extends string> = whileMatchCore<str, pat, ''>;
type whileMatchCore<str extends string, pat extends string, res extends string> =
	str extends `${infer match extends pat}${infer rest}` ?
	whileMatchCore<rest, pat, `${res}${match}`>
	: [res, str];