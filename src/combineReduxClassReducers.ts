import { combineReducers, ReducersMapObject } from 'redux'
import { ReduxClassWrapper } from './ReduxClass.decorator'

export function combineReduxClassReducers(reducers: ReducersMapObject) {
  const reducersKeys = Object.keys(reducers)
  const wrappedReducers: ReducersMapObject = {}
  for (let i = 0; i < reducersKeys.length; i++) {
    const reducerKey = reducersKeys[i]
    const reducer = reducers[reducerKey]
    wrappedReducers[reducerKey] = ReduxClassWrapper(reducer)
  }
  return combineReducers(wrappedReducers)
}