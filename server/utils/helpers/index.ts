import baseGet from 'server/utils/helpers/.internals/baseGet'; 
export function isUndefined(value : any) : boolean{
    return typeof value === 'undefined';
}

export function isArray(value : any) :  boolean{
    return Array.isArray(value);
}

export function defaultValue(value : any,defaultValue : any){
    return isUndefined(value) ? defaultValue : value
}

export function eq(value : any, other : any) : boolean {
    return value === other
}

const hasOwnProperty = Object.prototype.hasOwnProperty

export function has(object : object, key : string) : boolean{
    return object != null && hasOwnProperty.call(object, key)
}

export function isEmptyArray(array : Array<any>) : boolean{
    return array.length === 0
}


export function get(object : object, path : string | string[], defaultValue ?: any) {
    const result = object == null ? undefined : baseGet(object, path)
    return result === undefined ? defaultValue : result
}

export function isObject(value : any) {
    const type = typeof value
    return value != null && (type === 'object' || type === 'function')
}
  

export function isEmptyString(value : string) : boolean{
    return value.trim() === ''
}

export interface normalizeResult<T> {
    rejected : Array<any>,
    fulfilled : Array<T>
}

export function normalizeSettledPromise<T>(values : PromiseSettledResult<T>[]) : normalizeResult<T>{
    return values.reduce((acc : normalizeResult<T>,curr : PromiseSettledResult<T>)=>{
        if(curr.status === 'fulfilled') acc.fulfilled.push(curr.value);
        else acc.rejected.push(curr.reason);
        return acc;
    },{rejected : [],fulfilled :[]});
}

export function In<T>(value : T,arr : T[]) : boolean{
    return arr.some((val : T)=> val === value)
}

export function not(value : boolean) : boolean{
    return !value
}