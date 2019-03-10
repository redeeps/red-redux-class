// The Symbol used to tag the ReduxClass type. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
const REDUX_CLASS_NAME = 'redux-class.class'
const SYMBOL_TARGET = 'for'
const REDUX_CLASS_TYPE: symbol = Symbol[SYMBOL_TARGET](REDUX_CLASS_NAME)
export const ReduxClassSymbol = REDUX_CLASS_TYPE