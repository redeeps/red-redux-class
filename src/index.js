import 'babel-polyfill'
import ReduxClass from './ReduxClass.class'
import ReduxClassArray from './ReduxClassArray.class'
import * as ReduxClassArrayConstants from './ReduxClassArray.constants'
import { ReduxClassWrapper } from './ReduxClass.decorator'
import ReduxClassSymbol from './ReduxClassSymbol'
import combineReduxClassReducers from './combineReduxClassReducers'

module.exports = {
  ReduxClass,
  ReduxClassArray,
  ReduxClassArrayConstants,
  ReduxClassSymbol,
  ReduxClassWrapper,
  combineReduxClassReducers,
}
