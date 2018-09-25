import { combineReducers } from 'redux'
import ReduxClassWrapper, { CombinedReducers } from './ReduxClass.decorator'

export default function combineReduxClassReducers(reducers: CombinedReducers) {
  const reducersKeys = Object.keys(reducers)
  const wrappedReducers: CombinedReducers = {}
  for (let i = 0; i < reducersKeys.length; i++) {
    const reducerKey = reducersKeys[i]
    const reducer = reducers[reducerKey]
    wrappedReducers[reducerKey] = ReduxClassWrapper(reducer)
  }
  return combineReducers(wrappedReducers)
}