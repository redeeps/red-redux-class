import { ReduxClass } from '../ReduxClass.class'
import { ReduxClassArray } from '../ReduxClassArray.class'
import {
  ReduxClassWrapper,
  privateMethods,
  TAction,
} from '../ReduxClass.decorator'

describe('ReduxClass.decorator', function() {
  it('should set all objects to not new', function(done) {
    const state = new ReduxClass({
      inner: new ReduxClassArray([new ReduxClass({}), new ReduxClass({})]),
    })
    expect(state.isNew()).toBe(true)
    expect(state.get('inner').isNew()).toBe(true)
    expect(
      state
        .get('inner')
        .get(0)
        .isNew(),
    ).toBe(true)
    expect(
      state
        .get('inner')
        .get(1)
        .isNew(),
    ).toBe(true)
    privateMethods.traverseStateForNew(state)
    expect(state.isNew()).toBe(false)
    expect(state.get('inner').isNew()).toBe(false)
    expect(
      state
        .get('inner')
        .get(0)
        .isNew(),
    ).toBe(false)
    expect(
      state
        .get('inner')
        .get(1)
        .isNew(),
    ).toBe(false)
    done()
  })

  it('should be proper state', function(done) {
    const initialState = new ReduxClass({ value: true })
    const reducer = function(
      state: ReduxClass = initialState,
      action: TAction,
    ): ReduxClass {
      if (action) {
        return state.new()
      }
      return state.new()
    }
    const wrappedReducer = ReduxClassWrapper<ReduxClass>(reducer)
    const newState = wrappedReducer(initialState, { type: '' })
    const newState2 = wrappedReducer(newState, { type: '' })
    expect(ReduxClass.isReduxClass(newState)).toBe(true)
    expect((<ReduxClass>newState).isNew()).toBe(false)
    expect(ReduxClass.isReduxClass(newState2)).toBe(true)
    expect((<ReduxClass>newState2).isNew()).toBe(false)
    done()
  })

  it('is simple function', function(done) {
    const initialState = {}
    function reducer(state: object = initialState, action: TAction): object {
      if (action) {
        return state
      }
      return state
    }
    const wrappedReducer = ReduxClassWrapper(reducer)
    const newState = wrappedReducer(initialState, { type: '' })
    const newState2 = wrappedReducer(newState, { type: '' })
    expect(ReduxClass.isReduxClass(newState)).toBe(false)
    expect(typeof newState === 'object').toBe(true)
    expect(ReduxClass.isReduxClass(newState2)).toBe(false)
    expect(typeof newState2 === 'object').toBe(true)
    done()
  })
})
