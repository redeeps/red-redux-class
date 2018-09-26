import * as Logger from 'js-logger'
import ReduxClass from './ReduxClass.class'

export type TAction = {
  type: string
}

export type ReduxClassOrObject = ReduxClass | object

export interface IReducer<T> {
  (state: T, action: TAction): T
}

export interface IReducerAll {
  (state: object, action: TAction): object
  (state: ReduxClass, action: TAction): ReduxClass
  (state: ReduxClass | object, action: TAction): ReduxClass | object
}


export interface CombinedReducers {
  [index: string]: IReducer<object> | IReducer<ReduxClass>
}

type My<T> = T extends ReduxClass ? ReduxClass : object

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
function ReduxClassWrapper<T>(reducer: IReducer<My<T>>): IReducer<My<T>> {

  let decorated: IReducer<My<T>> = createReducer

  function stateReducerHandler(newState: My<T>): My<T> {
    if (!ReduxClass.isReduxClass(newState)) {
      Logger.warn('Reducer should be of ReduxClass type')
    }
    traverseStateForNew(<ReduxClass>newState)
    return newState
  }


  function decoratedStateReducer(state: My<T>, action: TAction): My<T> {
    const newState = reducer(state, action)
    return stateReducerHandler(newState)
  }

  function createReducer(state: My<T>, action: TAction): My<T> {
    const newState = reducer(state, action)
    if (ReduxClass.isReduxClass(state) || ReduxClass.isReduxClass(newState)) {
      stateReducerHandler(newState)
      decorated = decoratedStateReducer
    } else {
      decorated = reducer
    }
    return newState
  }

  function main(state: My<T>, action: TAction): My<T> {
    return decorated(state, action)
  }

  return main
}

export default ReduxClassWrapper

export const privateMethods = {
  traverseStateForNew,
  searchObjectForNew,
}
