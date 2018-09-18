import { expect } from 'chai'


import { ARRAY_KEY } from '../ReduxClassArray.constants'
import ReduxClassArray from '../ReduxClassArray.class'
import ReduxClass from '../ReduxClass.class'
import { privateMethods } from '../ReduxClass.decorator'

const { traverseStateForNew } = privateMethods

describe('ReduxClassArray.class', function () {

  const needsNewMethods = ["pop", "push", "shift", "unshift", "reverse", "copyWithin", "fill", "sort"]
  const needsConstructorMethods = ["slice", "filter", "map"]
  const needsConstructorAndNewMethods = ["splice"]
  describe('Object tree', () => {

    class ReducerTest extends ReduxClass {
      static types = {
        array: ReduxClassArray,
        obj1: ReduxClass,
        obj2: ReduxClass,
      }
    }

    class ReducerTest2 extends ReduxClass {
      static types = {
        inner: ReducerTest,
      }
    }

    it('should create instances of proper object inside', (done) => {
      const reducer = new ReducerTest({
        array: [1, 2, 3, 4],
        obj1: {
          value1: 'test1'
        },
        obj2: {
          value2: 'test2',
        },
        obj3: {
          value3: 'test3',
        }
      })
      expect(reducer.get('array') instanceof ReduxClassArray).to.be.true
      expect(reducer.get('obj1') instanceof ReduxClass).to.be.true
      expect(reducer.get('obj2') instanceof ReduxClass).to.be.true
      expect(reducer.get('obj3') instanceof ReduxClass).to.be.false
      expect(reducer.get('obj3') instanceof ReduxClassArray).to.be.false
      done()
    })


    it('should set array using proper construtor', (done) => {
      const reducer = new ReducerTest()
      reducer.set('array', [])
      expect(reducer.get('array') instanceof ReduxClassArray).to.be.true
      done()
    })

    it('should set array in deeper objects', (done) => {
      const reducer = new ReducerTest2({
        inner: {
          array: [],
          obj1: { value: true },
          obj2: { value: true },
          obj3: { value: true },
        }
      })
      expect(reducer.get('inner') instanceof ReduxClass).to.be.true
      expect(reducer.get('inner').get('array') instanceof ReduxClassArray).to.be.true
      expect(reducer.get('inner').get('obj1') instanceof ReduxClass).to.be.true
      expect(reducer.get('inner').get('obj2') instanceof ReduxClass).to.be.true
      expect(reducer.get('inner').get('obj3') instanceof ReduxClass).to.be.false
      done()
    })

    it('should set array in deeper objects on new()', (done) => {
      const reducer = new ReducerTest2({
        inner: {
          array: [],
          obj1: { value: true },
          obj2: { value: true },
          obj3: { value: true },
        }
      })
      const reducer2 = reducer.new()
      expect(reducer2.get('inner') instanceof ReduxClass).to.be.true
      expect(reducer2.get('inner').get('array') instanceof ReduxClassArray).to.be.true
      expect(reducer2.get('inner').get('obj1') instanceof ReduxClass).to.be.true
      expect(reducer2.get('inner').get('obj2') instanceof ReduxClass).to.be.true
      expect(reducer2.get('inner').get('obj3') instanceof ReduxClass).to.be.false
      done()
    })

    it('should set array in deeper objects using constructor', (done) => {
      const reducer = new ReducerTest2({
        inner: {
          array: [],
          obj1: { value: true },
          obj2: { value: true },
          obj3: { value: true },
        }
      })
      const reducer2 = new ReducerTest2(reducer)
      expect(reducer2.get('inner') instanceof ReduxClass).to.be.true
      expect(reducer2.get('inner').get('array') instanceof ReduxClassArray).to.be.true
      expect(reducer2.get('inner').get('obj1') instanceof ReduxClass).to.be.true
      expect(reducer2.get('inner').get('obj2') instanceof ReduxClass).to.be.true
      expect(reducer2.get('inner').get('obj3') instanceof ReduxClass).to.be.false
      done()
    })
  })

  describe('Static types', () => {
    class ReducerTest1 extends ReduxClass { }
    class ReducerTest2 extends ReduxClass { }
    class ReducerArrayElement extends ReduxClass { }
    class TestArray extends ReduxClassArray {
      static types = {
        0: ReducerArrayElement,
        test1: ReducerTest1,
        test2: ReducerTest2,
      }
    }
    describe('init', (done) => {
      it('should use array type when setting one item', (done) => {
        const testArray = new TestArray()
        testArray.set("0", {})
        expect(testArray.getLength()).to.be.eql(1)
        expect(testArray.get(0) instanceof ReducerArrayElement).to.be.true
        expect(testArray.get(0) instanceof ReduxClassArray).to.be.false
        done()
      })

      it('should use array type when initializing array', (done) => {
        const testArray = new TestArray([{ test1: 'test1' }, { test2: 'test1' }, { test2: 'test1' }])
        expect(testArray.getLength()).to.be.eql(3)
        expect(testArray.get(0) instanceof ReducerArrayElement).to.be.true
        expect(testArray.get(1) instanceof ReducerArrayElement).to.be.true
        expect(testArray.get(2) instanceof ReducerArrayElement).to.be.true
        done()
      })

      it('should create proper attributes and array elements', (done) => {
        const testArray = new TestArray([{ array1: 'array1' }], { test1: {}, test2: {} })
        expect(testArray.getLength()).to.be.eql(1)
        expect(testArray.get(0) instanceof ReducerArrayElement).to.be.true
        expect(testArray.get(0) instanceof ReduxClassArray).to.be.false
        expect(!!testArray[0]).to.be.false
        expect(testArray.get('test1') instanceof ReducerTest1).to.be.true
        expect(testArray.get('test2') instanceof ReducerTest2).to.be.true
        done()
      })
    })

    describe('set', (done) => {
      it('should use array type when setting array', (done) => {
        const testArray = new TestArray()
        testArray.set([{ test1: 'test1' }, { test2: 'test2' }])
        expect(testArray.getLength()).to.be.eql(2)
        expect(testArray.get('0') instanceof ReducerArrayElement).to.be.true
        expect(testArray.get('1') instanceof ReducerArrayElement).to.be.true
        expect(!!testArray[0]).to.be.false
        expect(!!testArray[0]).to.be.false
        done()
      })
  
      it('should use array type when initializing array', (done) => {
        const testArray = new TestArray()
        testArray.set({ test1: 'test1', test2: 'test2' })
        expect(testArray.getLength()).to.be.eql(0)
        expect(testArray.get('test1') instanceof ReducerTest1).to.be.true
        expect(testArray.get('test2') instanceof ReducerTest2).to.be.true
        done()
      })
  
      it('should use ReduxClassArray to set all data', (done) => {
        const testArray = new TestArray()
        testArray.set({ test1: 'test1', test2: 'test2' })
        expect(testArray.getLength()).to.be.eql(0)
        expect(testArray.get('test1') instanceof ReducerTest1).to.be.true
        expect(testArray.get('test2') instanceof ReducerTest2).to.be.true
        done()
      })
    })    
  })

  describe('privateProperties', () => {
    it('should have proper private properties', (done) => {
      const privateProperties = ReduxClassArray.privateProperties
      expect(privateProperties.indexOf('$$new')).to.not.be.equal(-1)
      expect(privateProperties.indexOf('$$typeof')).to.not.be.equal(-1)
      expect(privateProperties.indexOf('$$array')).to.not.be.equal(-1)
      done()
    })
  })


  describe('new', (done) => {
    class ReducerTest1 extends ReduxClass { }
    class ReducerTest2 extends ReduxClass { }
    class ReducerArrayElement extends ReduxClass {
      static types = {
        attr1: ReducerTest1,
        attr2: ReducerTest2,
      }
    }
    class MyArray extends ReduxClassArray {
      static types = {
        0: ReducerArrayElement,
      }
    }
    it('should use array type when setting array', (done) => {
      const reducer = new ReduxClass({
        arr: new MyArray([
          {
            attr1: { value: '1-attr1' },
            attr2: { value: '1-attr2' },
          },
          {
            attr1: { value: '2-attr1' },
            attr2: { value: '2-attr2' },
          },
          {
            attr1: { value: '3-attr1' },
            attr2: { value: '3-attr2' },
          },
        ])
      })
      traverseStateForNew(reducer)
      const newReducer = reducer.new()
      const x1 = newReducer.new('arr.0.attr1')
      expect(x1[1]).to.be.eql(newReducer)
      const x2 = newReducer.new('arr.0.attr2')
      expect(x2[1].getPath('arr.0') == newReducer.getPath('arr.0')).to.be.true
      expect(x2[1].getPath('arr.0.attr1') == x1[1].getPath('arr.0.attr1')).to.be.true
      expect(x2[1].getPath('arr.0.attr1') == newReducer.getPath('arr.0.attr1')).to.be.true
      expect(x2[1].getPath('arr.0.attr2') == newReducer.getPath('arr.0.attr2')).to.be.true
      expect(newReducer.getPath('arr.0.attr1').isNew()).to.be.true
      expect(newReducer.getPath('arr.0.attr2').isNew()).to.be.true
      expect(newReducer.getPath('arr.1.attr1').isNew()).to.be.false
      expect(newReducer.getPath('arr.1.attr2').isNew()).to.be.false
      expect(newReducer.getPath('arr.2.attr1').isNew()).to.be.false
      expect(newReducer.getPath('arr.2.attr2').isNew()).to.be.false
      expect(x2[1].getPath('arr.1.attr1').isNew()).to.be.false
      expect(x2[1].getPath('arr.1.attr2').isNew()).to.be.false
      expect(x2[1].getPath('arr.2.attr1').isNew()).to.be.false
      expect(x2[1].getPath('arr.2.attr2').isNew()).to.be.false
      done()
    })

    it('same path same result', (done) => {
      const reducer = new ReduxClass({
        arr: new MyArray([
          {
            attr1: { value: '1-attr1' },
            attr2: { value: '1-attr2' },
          },
          {
            attr1: { value: '2-attr1' },
            attr2: { value: '2-attr2' },
          },
          {
            attr1: { value: '3-attr1' },
            attr2: { value: '3-attr2' },
          },
        ])
      })
      traverseStateForNew(reducer)
      const x1 = reducer.new('arr.0.attr1')
      expect(x1[1].getPath('arr').isNew()).to.be.true
      expect(x1[1].getPath('arr.0').isNew()).to.be.true
      expect(x1[1].getPath('arr.0.attr1').isNew()).to.be.true
      const x2 = x1[1].new('arr.0.attr1')
      expect(x1[0] == x2[0]).to.be.true
      done()
    })

    it('should return all new elements on path', (done) => {
      const reducer = new ReduxClass({
        arr: new MyArray([
          {
            attr1: { value: '1-attr1' },
            attr2: { value: '1-attr2' },
          },
        ]),
      })
      traverseStateForNew(reducer)
      const x1 = reducer.new('arr.0.attr1')
      expect(x1[2] == x1[1].getPath('arr')).to.be.true
      expect(x1[3] == x1[1].getPath('arr.0')).to.be.true
      expect(x1[4] == x1[1].getPath('arr.0.attr1')).to.be.true
      done()
    })
  })


  describe('getPath', (done) => {
    class ReducerTest1 extends ReduxClass { }
    class ReducerTest2 extends ReduxClass { }
    class ReducerArrayElement extends ReduxClass {
      static types = {
        attr1: ReducerTest1,
        attr2: ReducerTest2,
      }
    }
    class MyArray extends ReduxClassArray {
      static types = {
        0: ReducerArrayElement,
      }
    }
    it('works same as get when single property name', (done) => {
      const reducer = new ReduxClass({
        arr: new MyArray([])
      })
      const arr = reducer.getPath('arr')
      const arr2 = reducer.get('arr')
      expect(arr).to.be.eql(arr2)
      expect(arr).to.be.eql(reducer.arr)
      done()
    })

    it('gets proper array element', (done) => {
      const reducer = new ReduxClass({
        arr: new MyArray([
          {
            attr1: { value: '1-attr1' },
            attr2: { value: '1-attr2' },
          },
          {
            attr1: { value: '2-attr1' },
            attr2: { value: '2-attr2' },
          },
          {
            attr1: { value: '3-attr1' },
            attr2: { value: '3-attr2' },
          },
        ])
      })
      const arrEl1 = reducer.getPath('arr.0')
      const arrEl2 = reducer.get('arr').get('0')
      expect(arrEl1).to.be.eql(arrEl2)
      expect(arrEl1).to.be.eql(reducer.arr.$$array['0'])
      done()
    })
  })


  it('should be an array', function (done) {
    const state = new ReduxClassArray([1, 2, 3])
    expect(state[ARRAY_KEY]).to.be.eql([1, 2, 3])
    expect(state.isNew()).to.be.true
    done()
  })

  it('new state should have different pointer but same data', function (done) {
    const state = new ReduxClassArray([1, 2, 3])
    const newState = state.new()
    expect(state === newState).to.be.false
    expect(state).to.be.eql(newState)
    done()
  })

  it('should set created obj to new', function (done) {
    const state = new ReduxClassArray([])
    state.$setNotNew()
    const newState = state.new()
    expect(newState.isNew()).to.be.true
    done()
  })

  it('should get value from array', function (done) {
    const state = new ReduxClassArray([1, 2])
    expect(state.get(0)).to.be.eql(1)
    expect(state.get("0")).to.be.eql(1)
    expect(state.get(1)).to.be.eql(2)
    expect(state.get("1")).to.be.eql(2)
    done()
  })

  it('should have additional attr', function (done) {
    const state = new ReduxClassArray([1, 2], { attr1: false, attr2: {} })
    expect(state.get('attr1')).to.be.eql(false)
    expect(state.get('attr2')).to.be.eql({})
    done()
  })

  it('should create same object', function (done) {
    const state = new ReduxClassArray([1, 2], { attr1: false, attr2: {} })
    const stateCopy = new ReduxClassArray(state)
    expect(state).to.be.eql(stateCopy)
    expect(state[ARRAY_KEY]).to.be.eql(stateCopy[ARRAY_KEY])
    expect(state === stateCopy).to.be.false
    done()
  })

  it('can run methods only on new state', function (done) {
    const state = new ReduxClassArray([])
    state.$setNotNew()
    needsNewMethods.forEach((methodName) => {
      try {
        state[methodName]()
      } catch (error) {
        expect(error.error).to.be.equal('Set on not new')
      }
    })
    done()
  })

  it('isReduxClassArray', function (done) {
    const stateArray = new ReduxClassArray()
    const state = new ReduxClass()
    expect(ReduxClassArray.isReduxClassArray(stateArray)).to.be.true
    expect(ReduxClassArray.isReduxClassArray(state)).to.be.false
    expect(ReduxClassArray.isReduxClassArray({})).to.be.false
    done()
  })

  it('methods should return new array', function (done) {
    const state = new ReduxClassArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    state.$setNotNew()
    const arr1 = state.filter((val) => val <= 5)
    expect(arr1).to.be.eql([1, 2, 3, 4, 5])

    const arr2 = state.map((val) => val + 1)
    expect(arr2).to.be.eql([2, 3, 4, 5, 6, 7, 8, 9, 10, 11])

    const arr3 = state.slice(0, 5)
    expect(arr3).to.be.eql([1, 2, 3, 4, 5])
    done()
  })

  it('should return new array and modify existing', function (done) {
    const state = new ReduxClassArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    state.$setNotNew()
    try {
      state.splice(1, 1)
    } catch (error) {
      expect(error.error).to.be.equal('Set on not new')
    }
    const newState = state.new()
    const removed = newState.splice(1, 1)
    expect(removed).to.be.eql([2])
    expect(newState[ARRAY_KEY]).to.be.eql([1, 3, 4, 5, 6, 7, 8, 9, 10])
    done()
  })

  it('should return array', function (done) {
    const state = new ReduxClassArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    expect(state.getFullArray()).to.be.eql([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    done()
  })

  it('should create new instances on the path', function (done) {
    const state = new ReduxClass({
      inner1: new ReduxClassArray([
        new ReduxClass({
          inner3: new ReduxClass({
            boolean: false,
          }),
          x: 1,
        }),
      ]),
      y: 3,
    })
    state.$setNotNew()
    state.inner1.$setNotNew()
    state.inner1.get(0).$setNotNew()
    state.inner1.get(0).inner3.$setNotNew()
    const [target, root] = state.new('inner1.0.inner3')
    expect(root.isNew()).to.be.true
    expect(root.inner1.isNew()).to.be.true
    expect(root.inner1.get(0).isNew()).to.be.true
    expect(root.inner1.get(0).inner3.isNew()).to.be.true
    expect(target.isNew()).to.be.true
    done()
  })

  describe('isEmpty', () => {
    it('should return true if array has no elements', (done) => {
      const arr = new ReduxClassArray([])
      expect(arr.isEmpty()).to.be.true
      done()
    })
    it('should return false if array has one element', (done) => {
      const arr = new ReduxClassArray([1])
      expect(arr.isEmpty()).to.be.false
      done()
    })
    it('should return false if array has more elements', (done) => {
      const arr = new ReduxClassArray([1,2,3])
      expect(arr.isEmpty()).to.be.false
      done()
    })
  })

  describe('toJSON', (done) => {
    it('should show array class as array', (done) => {
      const state = new ReduxClassArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
      expect(JSON.stringify(state)).to.be.equal('[1,2,3,4,5,6,7,8,9,10]')
      done()
    })
    it('should show empty array class as empty array', (done) => {
      const state = new ReduxClassArray([])
      expect(JSON.stringify(state)).to.be.equal('[]')
      done()
    })
  })
})