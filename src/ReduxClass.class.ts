import { IForEachInstanceCallback, IReduxClass } from './ReduxClass.interface'
import { Validator } from 'prop-types'
import { PureObject } from './ReduxClass.types'
import { ReduxClassException } from './ReduxClassException.class'
import { REDUX_CLASS_SYMBOL } from './ReduxClassSymbol'
import { ARRAY_KEY, NEW_KEY, TYPEOF_KEY } from './ReduxClass.constants'

export class ReduxClass extends PureObject implements IReduxClass {
  public ['constructor']: typeof ReduxClass
  protected [NEW_KEY]: boolean
  protected [TYPEOF_KEY]: symbol

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
  static defaults: PureObject = {}
  static types: PureObject = {}

  /**
   * Check if provided variable is a reduxClass object
   * @param {any} object
   */
  static isReduxClass(object: object | undefined): boolean {
    if (typeof object === 'undefined') {
      return false
    }
    const _object: PureObject = object
    return (
      typeof object === 'object' &&
      object !== null &&
      _object[TYPEOF_KEY] === REDUX_CLASS_SYMBOL
    )
  }

  static propType(): Validator<object> {
    const classConstructor = this
    return (props: object, propName: string, componentName: string) => {
      componentName = componentName || 'ANONYMOUS'
      const _props: PureObject = props
      if (!(_props[propName] instanceof classConstructor)) {
        return new Error(
          propName +
            ' in ' +
            componentName +
            ' should be instanceof ' +
            classConstructor.toString(),
        )
      }
      // assume all ok
      return null
    }
  }

  /**
   * Inits $$new variable which determines if object is new and can be changed during redux cycles
   * If object is not new, this.set will throw error
   */
  protected _initNew() {
    this._initHiddenProperty(NEW_KEY, true)
  }

  /**
   * Is used to check if object is ReduxClass
   */
  protected _initType() {
    this._initHiddenProperty(TYPEOF_KEY, REDUX_CLASS_SYMBOL)
  }

  protected _initialize(initialState: object | IReduxClass) {
    return this.setData(initialState)
  }

  /**
   * Use to create not enumerable properties
   * @param {string} key
   * @param {*} value
   */
  protected _initHiddenProperty(key: string, value: any) {
    Object.defineProperty(this, key, {
      configurable: false,
      enumerable: false,
      value,
      writable: true,
    })
  }
  /**
   * Init state with class default values
   */
  protected _initDefaults() {
    const defaults = this.constructor.defaults
    Object.keys(defaults).forEach((key: string) => {
      if (typeof this[key] === 'undefined') {
        this._setAttr(key, defaults[key])
      }
    })
  }

  constructor(initialState: object | ReduxClass = {}) {
    super()
    this._initNew()
    this._initType()
    this._initialize(initialState)
    this._initDefaults()
  }

  protected _new(this: ReduxClass): ReduxClass {
    return new this.constructor(this)
  }

  protected _setAttr(key: string, value: any): ReduxClass {
    const types = this.constructor.types
    if (value === null) {
      this[key] = value
      return this
    }
    if (typeof types[key] === 'string') {
      if (typeof value !== types[key]) {
        throw new ReduxClassException(
          'Bad value type',
          `Value type should be as set in static types property: '${key}'@${
            this.constructor.name
          } = ${this.constructor.types[key]}`,
        )
      }
    } else if (types[key] && !(value instanceof types[key])) {
      value = new types[key](value)
    }
    // specific key
    // default value
    if (types._ && !types[key] && !(value instanceof types._)) {
      value = new types._(value)
    }

    const oldValue = this.get(key)
    if (
      typeof oldValue !== typeof value &&
      oldValue !== undefined &&
      oldValue !== null &&
      value !== undefined &&
      value !== null
    ) {
      throw new ReduxClassException(
        'Bad value type',
        `Value type should be the same as previous value: '${key}'@${
          this.constructor.name
        }`,
      )
    }
    this[key] = value
    return this
  }

  public _shouldBeNew(): void {
    // public just for bind utils compatibility
    if (!this.isNew()) {
      throw new ReduxClassException(
        'Set on not new',
        'Create new object to set attributes',
      )
    }
  }
  /**
   * Iterate all properties of ReduxClass type and call callback method
   * @param {function} callback
   * @throws {ReduxClassException} Callback must be a function
   */
  public forEachInstance(callback: IForEachInstanceCallback): void {
    const keys = Object.keys(this).concat(Object.keys(this[ARRAY_KEY] || {}))
    keys.forEach((key: string) => {
      const attr = this.get(key)
      if (ReduxClass.isReduxClass(attr)) {
        callback(attr, key, this)
      }
    })
  }

  public getNew(): ReduxClass {
    if (this.isNew()) {
      return this
    }
    return this._new()
  }

  public newPath(path: string): ReduxClass[] {
    // has some path
    const pathParts = path.split('.')
    // if we have objects to traverse
    const childPath = pathParts[0] as string
    const child = this.get(childPath) as ReduxClass
    if (child === undefined) {
      throw new ReduxClassException(
        "Target class doesn't exist",
        `Please make sure target object exists: '${path}'@${
          this.constructor.name
        }`,
      )
    }
    if (ReduxClass.isReduxClass(child)) {
      const newSelf = this.getNew()
      const newPath = pathParts.slice(1).join('.') // get rest of the path
      if (newPath === '') {
        // return last but create new if is instance of ReduxClass
        const newChild = child.getNew()
        newSelf.set(childPath, newChild)
        return [
          newSelf.get(childPath), // target
          newSelf, // root
          newSelf.get(childPath),
        ] as ReduxClass[]
      }
      const [target, root, ...otherTargets] = child.newPath(newPath)
      newSelf.set(childPath, root)
      return [
        target, // target
        newSelf, // root
        newSelf.get(childPath),
        ...otherTargets,
      ] as ReduxClass[]
    } else {
      throw new ReduxClassException(
        'Target class is not ReduxClass',
        `Please make sure target object exists: '${path}'@${
          this.constructor.name
        }`,
      )
    }
  }

  public new(): ReduxClass {
    return this._new()
  }

  public get(key: string): any {
    return this[key]
  }

  public getPath(path: string) {
    if (path.indexOf('.') !== -1) {
      const pathArr = path.split('.')
      const pathArrCopy = [...pathArr]
      return pathArr.reduce(
        accumulator => accumulator.get(pathArrCopy.shift() || ''),
        this,
      )
    }
    const key = path
    return this.get(key)
  }

  /**
   * @param key Throws Error
   * @param value
   */
  public set(key: string, value: any): ReduxClass {
    this._shouldBeNew()
    return this._setAttr(key, value)
  }

  public setData(data: object): ReduxClass {
    const _data: PureObject = data
    this._shouldBeNew()
    Object.keys(data).forEach((key: string) => {
      this._setAttr(key, _data[key])
    })
    return this
  }

  public isNew(): boolean {
    return this[NEW_KEY]
  }

  public $setNew(): void {
    this[NEW_KEY] = true
  }

  public $setNotNew(): void {
    this[NEW_KEY] = false
  }

  public $getType(): symbol {
    return this[TYPEOF_KEY]
  }
}
