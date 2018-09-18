
export interface IForEachInstanceCallback {
  (attr: any, key: string, self: IReduxClass): void
}

export interface IReduxClass {
  forEachInstance(callback: IForEachInstanceCallback): void
  newPath(path: string): IReduxClass[]
  $setNew(): void
  $setNotNew(): void
  getNew(): IReduxClass
  set(key: string, value: any): IReduxClass
}