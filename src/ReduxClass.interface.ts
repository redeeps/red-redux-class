import { __generator } from '../node_modules/tslib';

export interface IForEachInstanceCallback {
  (attr: any, key: string, self: IReduxClass): void
}

export interface IReduxClass {
  forEachInstance(callback: IForEachInstanceCallback): void
  newPath(path: string): IReduxClass[]
  $setNew(): void
  $setNotNew(): void
  _shouldBeNew(): void
  getNew(): IReduxClass
  set(key: string, value: any): IReduxClass
}

export interface IReduxClassArray extends IReduxClass {
  isEmpty(): boolean
  toJSON(): any[]
  getLength(): number
  getArray(): any[]
  get(key: string | number): any
  set(key: string, value: any): IReduxClass
  setArray(_array: any[]): IReduxClass
  setArrayElement(key: number, value: any): IReduxClass
  // arrayMerge(_array: any[] | IReduxClassArray): void
  // arrayMergeRight(_array: any[] | IReduxClassArray): void
  // arrayMergeLeft(_array: any[] | IReduxClassArray): void
}