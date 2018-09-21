import ReduxClass from './ReduxClass.class'
import {
  ARRAY_KEY,
} from './ReduxClass.constants'
import {
  bindMethods,
  bindPrototype,
} from './reflection.utils'
import { PureObject } from './ReduxClass.types';
// methods to clone
const immutableMethods = ['includes', 'indexOf', 'keys', 'entries', 'forEach', 'every', 'some', 'reduce', 'reduceRight', 'toString', 'toLocaleString', 'join', 'reverse', 'lastIndexOf', 'find', 'findIndex', 'values', 'slice', 'filter', 'map']
const mutableMethods = ['pop', 'push', 'shift', 'unshift', 'reverse', 'copyWithin', 'fill', 'sort', 'splice']

// imitation of array for reducer state
export default class ReduxClassArray extends ReduxClass {
  protected [ARRAY_KEY]: any[]

  public static isReduxClassArray(object: PureObject): boolean {
    return ReduxClass.isReduxClass(object) && Array.isArray(object[ARRAY_KEY])
  }

  public static types = {}

  public static initialData(initialState: object, attributes = {}) {
    let array // why do we use composition instead of inheritance? couse babel is not able to properly extend bultin objects (also using case specific plugin)
    let state = {}
    if (ReduxClass.isReduxClass(initialState)) {
      array = [...initialState[ARRAY_KEY]]
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
  constructor(initialState: = [], attributes) {
    const {
      state,
      array,
    } = ReduxClassArray.initialData(initialState, attributes)
    super(state)
    this.initArray(array)
  }

  public initialize(initialState) {
    const {
      state,
      array,
    } = ReduxClassArray.initialData(initialState)
    this.set(ARRAY_KEY, array)
    super.initialize(state)
  }

  public initArray(_array: Array<Object>) {
    const arrayType = this.constructor.types[0]
    if (arrayType && arrayType.constructor) {
      _array = _array.map((el) => (el instanceof arrayType) ? el : new arrayType(el))
    }
    this._initHiddenProperty(ARRAY_KEY, _array)
  }

  public $new() {
    return new (<typeof ReduxClassArray>this.constructor)(this, null)
  }

  public get(key: string | number) {
    if (parseInt(key.toString()) === key) {
      return this[ARRAY_KEY][key]
    }
    return this[key]
  }

  public getFullArray() {
    return this[ARRAY_KEY]
  }

  public getLength() {
    return this[ARRAY_KEY].length
  }

  public set(data, value) {
    if (data && value && parseInt(data) === data) {
      // set value of array element
      const arrayType = this.constructor.types[0]
      if (arrayType && !(value instanceof arrayType)) {
        value = new arrayType(value)
      }
      this[ARRAY_KEY][data] = value
      return this
    }
    if (ReduxClassArray.isReduxClassArray(data)) {
      // if data is ReduxClassArray then overwrite $$array
      this[ARRAY_KEY] = data[ARRAY_KEY]
    }
    if (Array.isArray(data)) {
      this.initArray(data)
      return this
    }
    // rest will be set in ReduxClass
    super.set(data, value)
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