import { expect } from 'chai'

import ReduxClass from '../ReduxClass.class'
import ReduxClassArray from '../ReduxClassArray.class'
import ReduxClassWrapper, { privateMethods } from '../ReduxClass.decorator'
import combineReduxClassReducers from '../combineReduxClassReducers'

describe('ReduxClass.decorator', function () {
  it('should set all objects to not new', function (done) {
    const state = new ReduxClass({
      inner: new ReduxClassArray([
        new ReduxClass({}),
        new ReduxClass({}),
      ]),
    })
    expect(state.isNew()).to.be.true
    expect(state.get('inner').isNew()).to.be.true
    expect(state.get('inner').get(0).isNew()).to.be.true
    expect(state.get('inner').get(1).isNew()).to.be.true
    privateMethods.traverseStateForNew(state)
    expect(state.isNew()).to.be.false
    expect(state.get('inner').isNew()).to.be.false
    expect(state.get('inner').get(0).isNew()).to.be.false
    expect(state.get('inner').get(1).isNew()).to.be.false
    done()
  })

  it('should be proper state', function (done) {
    const initialState = new ReduxClass({ value: true })
    const reducer = function(state = initialState) { return state.new()}
    const wrappedReducer = ReduxClassWrapper(reducer)
    const newState = wrappedReducer()
    const newState2 = wrappedReducer(newState)
    expect(ReduxClass.isReduxClass(newState)).to.be.true
    expect(newState.isNew()).to.be.false
    expect(ReduxClass.isReduxClass(newState2)).to.be.true
    expect(newState2.isNew()).to.be.false
    done()
  })

  it('is simple function', function (done) {
    const initialState = {}
    const reducer = function(state = initialState) { return state}
    const wrappedReducer = ReduxClassWrapper(reducer)
    const newState = wrappedReducer()
    const newState2 = wrappedReducer(newState)
    expect(ReduxClass.isReduxClass(newState)).to.be.false
    expect(typeof newState === 'object').to.be.true
    expect(ReduxClass.isReduxClass(newState2)).to.be.false
    expect(typeof newState2 === 'object').to.be.true
    done()
  })
})