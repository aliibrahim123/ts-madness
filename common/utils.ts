/** check for equality */
export type eq <T, U> = T extends U ? true : false;

/** make type nicer and faster */
export type prettify<T> = { [K in keyof T]: prettify<T[K]> } & {};

/** make type nicer and faster, one depth */
export type prettifyDep1 <T> = { [K in keyof T]: T[K] } & {};

/** make the type checker happy */
export type satisfies <T, U> = T extends U ? T : never;

/** slice an array after first item, optionally override the return type */
export type rest <T extends any[], S extends any[] = T> = 
	T extends [any, ...infer rest extends S] ? rest : never;

/** remap an object by its values */
export type reverseObj <T extends Record<any, any>> = { [K in keyof T as T[K]]: K };

/** set a property of an object */
export type put <T, P extends keyof any, val extends any> = {
	[K in (keyof T) | P]: K extends P ? val : K extends keyof T ? T[K] : never
} extends infer T ? T : never;