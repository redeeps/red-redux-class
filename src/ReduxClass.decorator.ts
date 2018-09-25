import * as Logger from 'js-logger'
import ReduxClass from './ReduxClass.class'

export type TAction = {
  type: string
}

export interface IReducer {
  (state: ReduxClass | object, action: TAction): ReduxClass | object
  (state: object, action: TAction): object
  (state: ReduxClass, action: TAction): ReduxClass
}
export interface IReducer2<T> {
  (state: T, action: TAction): T
}

export interface CombinedReducers {
  [index: string]: IReducer
}

function searchObjectForNew(state: ReduxClass, parentKey: string = '', statePaths: string[] = []): string[] {
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
  try {
    state.$setNotNew()
  } catch (error) { }
  paths.forEach((path) => {
    try {
      const target = state.getPath(path)
      target.$setNotNew()
    } catch (error) { }
  })
  return paths
}

/**
 * ReduxClass wrapper need to change ReduxClass $$new property to false after each reducer execution.
 * Ensures that reducer is ReduxClass type.
 * @param {reducer method} reducer 
 */
function ReduxClassWrapper(reducer: IReducer): IReducer {

  let decorated: IReducer = createReducer

  function stateReducerHandler(newState: ReduxClass): ReduxClass {
    if (!ReduxClass.isReduxClass(newState)) {
      Logger.warn('Reducer should be of ReduxClass type')
    }
    traverseStateForNew(newState)
    return newState
  }


  function decoratedStateReducer(state: ReduxClass, action: TAction): ReduxClass {
    const newState = <ReduxClass>reducer(state, action)
    return stateReducerHandler(newState)
  }

  function createReducer(state: ReduxClass, action: TAction): ReduxClass
  function createReducer(state: object, action: TAction): object
  function createReducer(state: ReduxClass | object, action: TAction): ReduxClass | object {
    const newState = reducer(state, action)
    if (ReduxClass.isReduxClass(state) || ReduxClass.isReduxClass(newState)) {
      stateReducerHandler(<ReduxClass>newState)
      decorated = <IReducer>decoratedStateReducer
    } else {
      decorated = reducer
    }
    return newState
  }

  function main(state: ReduxClass, action: TAction): ReduxClass
  function main(state: object, action: TAction): object
  function main(state: ReduxClass | object, action: TAction): ReduxClass | object {
    return decorated(state, action)
  }

  return main
}

export const fn: IReducer = function (state: object, action: TAction): object {
  return {}
}



export default ReduxClassWrapper

export const privateMethods = {
  traverseStateForNew,
  searchObjectForNew,
}
