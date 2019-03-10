import { ReduxClass } from './ReduxClass.class'
import { AnyAction, Reducer } from 'redux'

export type TAction = AnyAction

type MixedState<T> = T extends ReduxClass ? ReduxClass : object

function searchObjectForNew(
  state: ReduxClass,
  parentKey: string = '',
  statePaths: string[] = [],
): string[] {
  state.forEachInstance((attr: ReduxClass, key: string) => {
    const path: string = parentKey + '.' + key
    searchObjectForNew(attr, path, statePaths)
    statePaths.push(path.slice(1))
  })
  return statePaths
}

function traverseStateForNew(state: ReduxClass, paths?: string[]): string[] {
  if (!paths) {
    paths = searchObjectForNew(state)
  }
  state.$setNotNew()
  paths.forEach(path => {
    const target = state.getPath(path)
    target.$setNotNew()
  })
  return paths
}

/**
 * ReduxClass wrapper need to change ReduxClass $$new property to false after each reducer execution.
 * Ensures that reducer is ReduxClass type.
 * @param {reducer method} reducer
 */
export function ReduxClassWrapper<T>(
  reducer: Reducer<MixedState<T>>,
): Reducer<MixedState<T>> {
  let decorated: Reducer<MixedState<T>> = createReducer

  function stateReducerHandler(newState: MixedState<T>): MixedState<T> {
    if (!ReduxClass.isReduxClass(newState)) {
      throw new Error('Reducer should be of ReduxClass type')
    }
    traverseStateForNew(newState as ReduxClass)
    return newState
  }

  function decoratedStateReducer(
    state: MixedState<T> | undefined,
    action: TAction,
  ): MixedState<T> {
    const newState = reducer(state, action)
    return stateReducerHandler(newState)
  }

  function createReducer(
    state: MixedState<T> | undefined,
    action: TAction,
  ): MixedState<T> {
    const newState = reducer(state, action)
    if (ReduxClass.isReduxClass(state) || ReduxClass.isReduxClass(newState)) {
      stateReducerHandler(newState)
      decorated = decoratedStateReducer
    } else {
      decorated = reducer
    }
    return newState
  }

  function main(
    state: MixedState<T> | undefined,
    action: TAction,
  ): MixedState<T> {
    return decorated(state, action)
  }

  return main
}

export const privateMethods = {
  searchObjectForNew,
  traverseStateForNew,
}
