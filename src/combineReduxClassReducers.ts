import {
  combineReducers,
  ReducersMapObject,
  Reducer,
  AnyAction,
  Action,
} from 'redux'
import { ReduxClassWrapper } from './ReduxClass.decorator'

export function combineReduxClassReducers<S, A extends Action = AnyAction>(
  reducers: ReducersMapObject<S, A>,
): Reducer<S, A>

export function combineReduxClassReducers<S, A extends Action = AnyAction>(
  reducers: ReducersMapObject<S, A | any>,
) {
  const wrappedReducers: ReducersMapObject<S, A> = { ...reducers }
  for (const reducerKey in reducers) {
    if (reducers.hasOwnProperty(reducerKey)) {
      const reducer = reducers[reducerKey]
      wrappedReducers[reducerKey] = ReduxClassWrapper(reducer)
    }
  }
  return combineReducers<S, A>(wrappedReducers)
}
