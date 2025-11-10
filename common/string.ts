export type rmPrefix<str extends string, pat extends string> = str extends `${pat}${infer rest}` ? rest : str;
export type rmSuffix<str extends string, pat extends string> = str extends `${infer rest}${pat}` ? rest : str;

export type hasPrefix<str extends string, pat extends string> = str extends `${pat}${string}` ? true : false;
export type hasSuffix<str extends string, pat extends string> = str extends `${string}${pat}` ? true : false;

export type toChars<str extends string> =
	str extends `${infer char}${infer rest}` ? [char, ...toChars<rest>] : [];
export type toCharsRev<str extends string> =
	str extends `${infer char}${infer rest}` ? [...toCharsRev<rest>, char] : [];

export type firstChar<str extends string> = str extends `${infer char}${string}` ? char : never;

export type whileMatch<str extends string, pat extends string> = whileMatchCore<str, pat, ''>;
type whileMatchCore<str extends string, pat extends string, res extends string> =
	str extends `${infer match extends pat}${infer rest}` ?
	whileMatchCore<rest, pat, `${res}${match}`>
	: [res, str];