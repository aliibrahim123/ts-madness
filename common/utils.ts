export type eq <T, U> = T extends U ? true : false;

export type prettify<T> = { [K in keyof T]: prettify<T[K]> } & {};