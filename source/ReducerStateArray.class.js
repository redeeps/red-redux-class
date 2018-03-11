import ReduxClass from './ReduxClass.class'
import { copy, bindArrayPrototype } from './reflection.utils'
import { ARRAY_KEY } from './ReduxClassArray.constants'
//methods to clone
const justPassMethods = ["includes", "indexOf", "keys", "entries", "forEach", "every", "some", "reduce", "reduceRight", "toString", "toLocaleString", "join", "reverse", "lastIndexOf", "find", "findIndex", "values"]
const needsNewMethods = ["pop", "push", "shift", "unshift", "reverse", "copyWithin", "fill", "sort"]
const needsConstructorMethods = ["slice", "filter", "map"]
const needsConstructorAndNewMethods = ["splice"]

//imitation of array for reducer state
export default class ReduxClassArray extends ReduxClass {
  constructor(initialState = [], attributes) {
    const { state, array } = ReduxClassArray.initialData(initialState, attributes)
    super(state)
    this.initArray(array)
  }

  static privateProperties = [...ReduxClass.privateProperties, ARRAY_KEY]

  static isReduxClassArray(object) {
    return ReduxClass.isReduxClass(object) && Array.isArray(object[ARRAY_KEY])
  }

  static initialData(initialState, attributes = {}) {
    let array     // why do we use composition instead of inheritance? couse babel is not able to properly extend bultin objects (also using case specific plugin)
    let state = {}
    if (ReduxClass.isReduxClass(initialState)) {
      array = [...initialState[ARRAY_KEY]]
      state = { ...initialState, ...attributes }
    } else if (Array.isArray(initialState)) {
      array = [...initialState]
      state = { ...attributes }
    } else {
      array = []
      state = initialState
    }
    return { state, array }
  }

  initialize(initialState) {
    const { state, array } = ReduxClassArray.initialData(initialState)
    this.set(ARRAY_KEY, array)
    super.initialize(state)
  }

  initArray(array) {
    const arrayType = this.constructor.types[0]
    if (arrayType && arrayType.constructor) {
      array = array.map((el) => (el instanceof arrayType) ? el : new arrayType(el))
    }
    Object.defineProperty(this, ARRAY_KEY, {
      value: array,
      enumerable: false,
      writable: true,
      configurable: false,
    })
  }

  $new() {
    return new this.constructor(this)
  }

  get(key) {
    if (parseInt(key) == key) {
      return this[ARRAY_KEY][key]
    }
    return this[key]
  }

  getFullArray() {
    return this[ARRAY_KEY]
  }

  getLength() {
    return this[ARRAY_KEY].length
  }

  set(data, value) {
    if (data && value && parseInt(data) == data) {
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
}
//clone proper methods
copy(ReduxClassArray, Array, justPassMethods, 'justPass', [], bindArrayPrototype)
copy(ReduxClassArray, Array, needsNewMethods, 'needsNew', [], bindArrayPrototype)
copy(ReduxClassArray, Array, needsConstructorMethods, 'needsConstructor', [], bindArrayPrototype)
copy(ReduxClassArray, Array, needsConstructorAndNewMethods, 'needsConstructorAndNew', [], bindArrayPrototype)

window.ReduxClassArray = ReduxClassArray