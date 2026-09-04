//#region src/utils/types.d.ts
type RemoveIndexSignature<T> = { [K in keyof T as string extends K ? never : number extends K ? never : symbol extends K ? never : K]: T[K]; };
type Prettify<T> = { [K in keyof T]: T[K]; } & {};
//#endregion
export { Prettify, RemoveIndexSignature };