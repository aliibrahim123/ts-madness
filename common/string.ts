export type rmPrefix <T extends string, P extends string> = T extends `${P}${infer R}` ? R : T;
export type rmSuffix <T extends string, P extends string> = T extends `${infer R}${P}` ? R : T;

export type hasPrefix <T extends string, P extends string> = T extends `${P}${string}` ? true : false;
export type hasSuffix <T extends string, P extends string> = T extends `${string}${P}` ? true : false;

export type toChars <T extends string> = T extends `${infer F}${infer R}` ? [F, ...toChars<R>] : [];
export type toCharsRev <T extends string> = T extends `${infer F}${infer R}` ? [...toCharsRev<R>, F] : [];