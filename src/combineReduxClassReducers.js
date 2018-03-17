import { combineReducers } from 'redux'
import ReduxClassWrapper from './ReduxClass.decorator'

export default function combineReduxClassReducers(reducers) {
  const reducersKeys = Object.keys(reducers)
  const wrappedReducers = {}
  for (let i = 0; i < reducersKeys.length; i++) {
    const reducerKey = reducersKeys[i]
    const reducer = reducers[reducerKey]
    wrappedReducers[reducerKey] = ReduxClassWrapper(reducer, reducerKey)
  }
  return combineReducers(wrappedReducers)
}