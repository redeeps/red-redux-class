import { ARRAY_KEY } from "./ReduxClass.constants";
import ReduxClassException from "./ReduxClassException.class";
import { PureObject } from './ReduxClass.types';
import ReduxClass from './ReduxClass.class';

export function bindPrototype(prototype: PureObject, key: string, _target: object, needsNew = false) {
  if (typeof prototype[key] === "function") {
    if (needsNew) {
      return function (this: ReduxClass) {
        this._shouldBeNew();
        return prototype[key].apply(this[ARRAY_KEY], arguments);
      };
    }
    return function (this: ReduxClass) {
      return prototype[key].apply(this[ARRAY_KEY], arguments);
    };
  }
  throw new ReduxClassException(
    `No such method '${key}()' in '${prototype.constructor.name}' prototype`,
    "Provide proper method keys of prototype"
  );
}

// Copies the properties from one class to another
export function bindMethods(
  target: Function,
  source: Function,
  keys: string[],
  needsNew = false,
  method = bindPrototype,
  exclude: any[] = []
) {
  for (let key of keys) {
    if (source.prototype[key]) {
      if (exclude.indexOf(key) === -1) {
        let desc = Object.getOwnPropertyDescriptor(source.prototype, key);
        Object.defineProperty(target.prototype, key, {
          ...desc,
          value: method(source.prototype, key, target, needsNew)
        });
      }
    }
  }
}
