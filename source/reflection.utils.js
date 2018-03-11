import { ARRAY_KEY } from './ReduxClassArray.constants'
import ReduxClassException from './ReduxClassException.class'

export function bindPrototype(prototype, key, type = 'justPass', _target) {
  if (typeof prototype[key] === 'function') {
    switch (type) {
      case 'justPass':
        return function () {
          return prototype[key].apply(this, arguments)
        }
      case 'needsNew':
        return function () {
          this.$shouldBeNew()
          return prototype[key].apply(this, arguments)
        }
      case 'needsConstructor':
        return function () {
          return new _target(prototype[key].apply(this, arguments))
        }
      case 'needsConstructorAndNew':
        return function () {
          this.$shouldBeNew()
          return new _target(prototype[key].apply(this, arguments))
        }
    }
  }
  throw new ReduxClassException(`No such method '${key}()' in '${prototype.constructor.name}' prototype`, 'Provide proper method keys of prototype')
}

export function bindArrayPrototype(prototype, key, type = 'justPass', _target) {
  if (typeof prototype[key] === 'function') {
    switch (type) {
      case 'justPass':
        return function () {
          return prototype[key].apply(this[ARRAY_KEY], arguments)
        }
      case 'needsNew':
        return function () {
          this.$shouldBeNew()
          return prototype[key].apply(this[ARRAY_KEY], arguments)
        }
      case 'needsConstructor':
        return function () {
          return prototype[key].apply(this[ARRAY_KEY], arguments)
        }
      case 'needsConstructorAndNew':
        return function () {
          this.$shouldBeNew()
          return prototype[key].apply(this[ARRAY_KEY], arguments)
        }
    }
  }
  throw new ReduxClassException(`No such method '${key}()' in '${prototype.constructor.name}' prototype`, 'Provide proper method keys of prototype')
}

// Copies the properties from one class to another
export function copy(_target, _source, keys, type = 'justPass', exclude = [], method = bindPrototype) {
  for (let key of keys) {
    if (_source.prototype[key]) {
      if (exclude.indexOf(key) === -1) {
        let desc = Object.getOwnPropertyDescriptor(_source.prototype, key)
        Object.defineProperty(_target.prototype, key, { ...desc, value: method(_source.prototype, key, type, _target) })
      }
    }
  }
}