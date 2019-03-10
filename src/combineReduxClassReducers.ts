import { combineReducers, ReducersMapObject } from 'redux'
import { ReduxClassWrapper } from './ReduxClass.decorator'

export function combineReduxClassReducers(reducers: ReducersMapObject) {
  const reducersKeys = Object.keys(reducers)
  const wrappedReducers: ReducersMapObject = {}
  for (const reducerKey of reducersKeys) {
    const reducer = reducers[reducerKey]
    wrappedReducers[reducerKey] = ReduxClassWrapper(reducer)
  }
  return combineReducers(wrappedReducers)
}
