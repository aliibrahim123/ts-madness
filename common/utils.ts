export type eq <T, U> = T extends U ? true : false;

export type prettify<T> = { [K in keyof T]: prettify<T[K]> } & {};

export type satisfies <T, U> = T extends U ? T : never;

export type rest <T extends any[], S extends any[] = T> = 
	T extends [any, ...infer rest extends S] ? rest : never;

export type reverseObj <T extends Record<any, any>> = { [K in keyof T as T[K]]: K };