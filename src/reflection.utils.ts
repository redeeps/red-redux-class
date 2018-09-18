import { ARRAY_KEY } from "./ReduxClassArray.constants";
import ReduxClassException from "./ReduxClassException.class";

export function bindPrototype(prototype: object, key: string, _target: object, needsNew = false) {
  if (typeof prototype[key] === "function") {
    if (needsNew) {
      return function () {
        this.$shouldBeNew();
        return prototype[key].apply(this[ARRAY_KEY], arguments);
      };
    }
    return function () {
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
  _target: Object,
  _source: Object,
  keys: Array<string>,
  needsNew = false,
  method = bindPrototype,
  exclude = []
) {
  for (let key of keys) {
    if (_source.prototype[key]) {
      if (exclude.indexOf(key) === -1) {
        let desc = Object.getOwnPropertyDescriptor(_source.prototype, key);
        Object.defineProperty(_target.prototype, key, {
          ...desc,
          value: method(_source.prototype, key, _target, needsNew)
        });
      }
    }
  }
}
