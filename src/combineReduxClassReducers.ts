import {
  combineReducers,
  ReducersMapObject,
  Reducer,
  AnyAction,
  Action,
} from 'redux'
import { ReduxClassWrapper } from './ReduxClass.decorator'

export function combineReduxClassReducers<S>(
  reducers: ReducersMapObject<S, any>,
): Reducer<S>

export function combineReduxClassReducers<S, A extends Action = AnyAction>(
  reducers: ReducersMapObject<S, A>,
): Reducer<S, A>

export function combineReduxClassReducers<S, A extends Action = AnyAction>(
  reducers: ReducersMapObject<S, A | any>,
) {
  const reducersKeys: Array<keyof S> = Object.keys(reducers) as Array<keyof S>
  const wrappedReducers: ReducersMapObject<S, A> = {}
  for (const reducerKey of reducersKeys) {
    const reducer = reducers[reducerKey]
    wrappedReducers[reducerKey] = ReduxClassWrapper(reducer)
  }
  return combineReducers<S, A>(wrappedReducers)
}
