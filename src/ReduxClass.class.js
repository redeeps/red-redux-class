import {
  set,
  get
} from 'lodash'
import Logger from 'js-logger'
import ReduxClassException from './ReduxClassException.class'
import ReduxClassSymbol from './ReduxClassSymbol'
import {
  ARRAY_KEY,
  NEW_KEY,
  TYPEOF_KEY
} from './ReduxClassArray.constants'

export default class ReduxClass {
  constructor(initialState = {}) {
    this.initType()
    this.initNew()
    this.initialize(initialState)
    this.initDefaults()
  }
  /** 
   * If class needs properties of specific type use "types" object to define them.
   * Classes can be used or primitives types strings: "boolean", "number", "string", "object"
   *     static types = {
   *       custom: Custom,
   *       boolean: 'boolean',
   *       string: 'string',
   *       object: 'object',
   *       number: 'number',
   *     }
   */
  static types = {}

  static privateProperties = [NEW_KEY, TYPEOF_KEY]

  /**
   * Check if provided variable is a reduxClass object
   * @param {any} object 
   */
  static isReduxClass(object) {
    return typeof object === 'object' && object !== null && object[TYPEOF_KEY] === ReduxClassSymbol
  }

  initialize(initialState) {
    this.$set(initialState)
  }

  /**
   * Inits $$new variable which determines if object is new and can be changed during redux cycles
   * If object is not new, this.set will throw error
   */
  initNew() {
    Object.defineProperty(this, NEW_KEY, {
      value: true,
      enumerable: false,
      writable: true,
    })
  }

  /**
   * Is used to check if object is ReduxClass
   */
  initType() {
    Object.defineProperty(this, TYPEOF_KEY, {
      value: ReduxClassSymbol,
      enumerable: false,
      writable: false,
      configurable: false,
    })
  }

  /**
   * Init state with class default values
   */
  initDefaults() {
    const defaults = this.constructor.defaults
    if (defaults) {
      Object.keys(defaults).forEach((key) => {
        if (typeof this[key] === 'undefined') {
          this.set(key, defaults[key])
        }
      })
    }
  }

/**
 * Iterate all properties of ReduxClass type and call callback method
 * @param {function} callback 
 * @throws {ReduxClassException} Callback must be a function
 */
  forEachInstance(callback) {
    if (typeof callback !== 'function') {
      throw new ReduxClassException('Not a function', 'Callback must be a function')
    }
    const keys = Object.keys(this).concat(Object.keys(this[ARRAY_KEY] || {}))
    keys.forEach((key) => {
      const attr = this.get(key)
      if (ReduxClass.isReduxClass(attr)) {
        callback(attr, key, this)
      }
    })
  }

  new(path) {
    if (path && typeof path === 'string') {
      // has some path
      const pathParts = path.split('.')
      // if we have objects to traverse
      const childPath = pathParts[0]
      const child = this.get(childPath)
      if (child === undefined) {
        throw new ReduxClassException('Target class doesn\'t exist', `Please make sure target object exists: '${path}'@${this.constructor.name}`)
      }
      if (ReduxClass.isReduxClass(child)) {
        const newSelf = this.isNew() ? this : this.$new()
        const newPath = pathParts.slice(1).join('.') // get rest of the path
        if (newPath === '') {
          // return last but create new if is instance of ReduxClass
          const newChild = child.isNew() ? child : child.$new()
          newSelf.set(childPath, newChild)
          return [
            newSelf.get(childPath), //target
            newSelf, //root
            newSelf.get(childPath),
          ]
        }
        const [target, root, ...otherTargets] = child.new(newPath)
        newSelf.set(childPath, root)
        return [
          target, //target
          newSelf, //root
          newSelf.get(childPath),
          ...otherTargets,
        ]
      } else {
        throw new ReduxClassException('Target class is not ReduxClass', `Please make sure target object exists: '${path}'@${this.constructor.name}`)
      }
    }
    return this.$new()
  }

  $new() {
    return new this.constructor(this)
  }

  set(data, value) {
    return this.$set.apply(this, arguments)
  }

  get(key) {
    return this[key]
  }

  getPath(path) {
    if (path.indexOf('.') !== -1) {
      const pathArr = path.split('.')
      const pathArrCopy = [...pathArr]
      try {
        return pathArr.reduce((accumulator) => accumulator.get(pathArrCopy.shift()), this)
      } catch (error) {
        Logger.warn(error)
      }
    }
    return this.get(path)
  }

  $shouldBeNew() {
    if (!this.isNew()) {
      throw new ReduxClassException('Set on not new', 'Create new object to set attributes')
    }
  }

  $set(data, value) {
    this.$shouldBeNew()
    if (typeof data === 'string') {
      return this.$setAttr(data, value)
    }
    if (typeof data === 'object') {
      Object.keys(data).forEach((key) => {
        this.$setAttr(key, data[key])
      })
      return this
    }
    throw new ReduxClassException('Bad data type', 'Data needs to be an object or string')
  }

  isNew() {
    return this[NEW_KEY]
  }

  $setNew() {
    this[NEW_KEY] = true
  }

  $setNotNew() {
    this[NEW_KEY] = false
  }

  $setAttr(key, value) {
    const types = this.constructor.types
    if (value === null) {
      this[key] = value
      return this
    }
    if (typeof types[key] === 'string') {
      if (typeof value !== types[key]) {
        throw new ReduxClassException('Bad value type', `Value type should be as set in static types property: '${key}'@${this.constructor.name} = ${this.constructor.types[key]}`)
      }
    } else if (types[key] && !(value instanceof types[key])) {
      value = new types[key](value)
    }
    // specific key
    // default value
    if (types['_'] && !types[key] && !(value instanceof types['_'])) {
      value = new types['_'](value)
    }

    const oldValue = this.get(key)
    if (typeof oldValue !== typeof value &&
      oldValue !== undefined &&
      oldValue !== null &&
      value !== undefined &&
      value !== null
    ) {
      throw new ReduxClassException('Bad value type', `Value type should be the same as previous value: '${key}'@${this.constructor.name}`)
    }
    this[key] = value
    return this
  }

  static propType() {
    const classConstructor = this
    return  (props, propName, componentName) => {
      componentName = componentName || 'ANONYMOUS'
    
      if (!(props[propName] instanceof classConstructor)) {
        return new Error(propName + ' in ' + componentName + " should be instanceof " + classConstructor.toString())
      }
    
      // assume all ok
      return null
    }
  }
  
}