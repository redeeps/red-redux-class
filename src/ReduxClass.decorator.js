import { get } from 'lodash'
import Logger from 'js-logger'
import ReduxClass from './ReduxClass.class'

function searchObjectForNew(state, parentKey = '', statePaths = []) {
  state.forEachInstance((attr, key, parent) => {
    const path = parentKey + '.' + key
    searchObjectForNew(attr, path, statePaths)
    statePaths.push(path.slice(1))
  })
  return statePaths
}

function traverseStateForNew(state, paths) {
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
export function ReduxClassWrapper(reducer) {

  let decorated = decoratedReducer

  function stateReducerHandler(newState) {
    if (!ReduxClass.isReduxClass(newState)) {
      Logger.warn('Reducer should be of ReduxClass type')
    }
    traverseStateForNew(newState)
    return newState
  }

  function decoratedStateReducer(state, action) {
    const newState = reducer(state, action)
    return stateReducerHandler(newState)
  }

  function decoratedReducer(state, action) {
    const newState = reducer(state, action)
    if (ReduxClass.isReduxClass(state) || ReduxClass.isReduxClass(newState)) {
      stateReducerHandler(newState)
      decorated = decoratedStateReducer
    } else {
      decorated = reducer
    }
    return newState
  }

  return function (state, action) {
    return decorated(state, action)
  }
}

export default ReduxClassWrapper

export const privateMethods = {
  traverseStateForNew,
  searchObjectForNew,
}
