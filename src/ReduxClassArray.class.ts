import ReduxClass from './ReduxClass.class'
import {
  ARRAY_KEY,
} from './ReduxClass.constants'
import {
  bindMethods,
  bindPrototype,
} from './reflection.utils'
import { PureObject } from './ReduxClass.types';
import { IReduxClassArray } from './ReduxClass.interface';
// methods to clone
const immutableMethods = ['includes', 'indexOf', 'keys', 'entries', 'forEach', 'every', 'some', 'reduce', 'reduceRight', 'toString', 'toLocaleString', 'join', 'reverse', 'lastIndexOf', 'find', 'findIndex', 'values', 'slice', 'filter', 'map']
const mutableMethods = ['pop', 'push', 'shift', 'unshift', 'reverse', 'copyWithin', 'fill', 'sort', 'splice']

// imitation of array for reducer state
export default class ReduxClassArray extends ReduxClass implements IReduxClassArray {
  protected [ARRAY_KEY]: any[]

  public static isReduxClassArray(object: object): boolean {
    const _object: PureObject = object
    return ReduxClass.isReduxClass(_object) && Array.isArray(_object[ARRAY_KEY])
  }

  public static initialData(initialState: any[] | ReduxClassArray, attributes: object = {}) {
    let array // why do we use composition instead of inheritance? couse babel is not able to properly extend bultin objects (also using case specific plugin)
    let state = {}
    if (ReduxClass.isReduxClass(initialState)) {
      array = (<ReduxClassArray>initialState).getArray()
      state = {
        ...initialState,
        ...attributes,
      }
    } else if (Array.isArray(initialState)) {
      array = [...initialState]
      state = {
        ...attributes,
      }
    } else {
      array = []
      state = initialState
    }
    return {
      state,
      array,
    }
  }

  constructor(initialState: any[] | ReduxClassArray = [], attributes: object = {}) {
    const {
      state,
      array,
    } = ReduxClassArray.initialData(initialState, attributes)
    super(state)
    this.initArray(array)
  }

  public initialize(initialState: any[] | ReduxClassArray) {
    const {
      state,
      array,
    } = ReduxClassArray.initialData(initialState)
    this.set(ARRAY_KEY, array)
    super.initialize(state)
  }

  public initArray(_array: any[]) {
    const arrayType = this.constructor.types[0]
    if (arrayType && arrayType.constructor) {
      _array = _array.map((el) => (el instanceof arrayType) ? el : new arrayType(el))
    }
    this._initHiddenProperty(ARRAY_KEY, _array)
  }

  public get(key: string | number): any {
    if (typeof key === 'number' || parseInt(key.toString()).toString() === key) {
      return this.getArrayElement(<number>key)
    }
    return this[key]
  }

  public getArrayElement(key: number): any {
    return this[ARRAY_KEY][key]
  }

  public getArray() {
    return this[ARRAY_KEY]
  }

  public getFullArray() {
    return this.getArray()
  }

  public getLength() {
    return this[ARRAY_KEY].length
  }

  public set(key: string | number, value: any): ReduxClassArray {
    const _key: string = key + ''
    if (parseInt(_key) + '' === _key) {
      this.setArrayElement(parseInt(_key), value)
      return this
    }
    // rest will be set in ReduxClass
    super.set(_key, value)
    return this
  }

  public setArray(_array: any[]): ReduxClassArray {
    this._shouldBeNew()
    const arrayType = this.constructor.types[0]
    this[ARRAY_KEY] = _array.map((value: any): any => {
      if (arrayType && !(value instanceof arrayType)) {
        value = new arrayType(value)
      }
      return value
    })
    return this
  }

  public setArrayElement(key: number, value: any): ReduxClassArray {
    this._shouldBeNew()
    const arrayType = this.constructor.types[0]
    if (arrayType && !(value instanceof arrayType)) {
      value = new arrayType(value)
    }
    this[ARRAY_KEY][key] = value
    return this
  }

  public isEmpty(): boolean {
    return this[ARRAY_KEY].length === 0
  }

  public toJSON(): any[] {
    return this[ARRAY_KEY]
  }
}
// clone proper methods
bindMethods(ReduxClassArray, Array, immutableMethods, false, bindPrototype)
bindMethods(ReduxClassArray, Array, mutableMethods, true, bindPrototype)