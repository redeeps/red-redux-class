import { expect } from 'chai'
import { ReduxClass } from '../ReduxClass.class'

describe('ReduxClass.class', function () {

  class Custom {

  }

  class TestState extends ReduxClass {
    static types = {
      custom: Custom,
      boolean: 'boolean',
      string: 'string',
      object: 'object',
      number: 'number',
    }
  }


  describe('set', () => {
    it('should throw error if type changes from boolean', function (done) {
      const state = new ReduxClass({
        boolean: true,
        number: 0,
        string: '',
        object: {},
      })
      let vars = [10, '', {}]
      vars.forEach((value) => {
        try {
          state.set('boolean', value)
        } catch (error) {
          expect(error.error).to.be.equal('Bad value type')
        }
      })
      done()
    })
    it('should throw error if type changes from number', function (done) {
      const state = new ReduxClass({
        number: 0,
      })
      let vars = [true, '', {}]
      vars.forEach((value) => {
        try {
          state.set('number', value)
        } catch (error) {
          expect(error.error).to.be.equal('Bad value type')
        }
      })
      done()
    })
    it('should throw error if type changes from string', function (done) {
      const state = new ReduxClass({
        string: '',
      })
      let vars = [true, 10, {}]
      vars.forEach((value) => {
        try {
          state.set('string', value)
        } catch (error) {
          expect(error.error).to.be.equal('Bad value type')
        }
      })
      done()
    })
    it('should throw error if type changes from object', function (done) {
      const state = new ReduxClass({
        object: {},
      })
      let vars = [true, '', 10]
      vars.forEach((value) => {
        try {
          state.set('object', value)
        } catch (error) {
          expect(error.error).to.be.equal('Bad value type')
        }
      })
      done()
    })
    it('should throw error if type is different from types property from boolean', function (done) {
      const state = new TestState()
      let vars = [10, '', {}]
      vars.forEach((value) => {
        const set = state.set.bind(state, 'boolean', value)
        expect(set).to.throw()
      })
      const set = state.set.bind(state, 'boolean', true)
      expect(set).to.not.throw()
      done()
    })
    it('should throw error if type is different from types property from number', function (done) {
      const state = new TestState()
      let vars = [true, '', {}]
      vars.forEach((value) => {
        const set = state.set.bind(state, 'number', value)
        expect(set).to.throw()
      })
      const set = state.set.bind(state, 'number', 10)
      expect(set).to.not.throw()
      done()
    })
    it('should throw error if type is different from types property from string', function (done) {
      const state = new TestState()
      let vars = [true, 10, {}]
      vars.forEach((value) => {
        const set = state.set.bind(state, 'string', value)
        expect(set).to.throw()
      })
      const set = state.set.bind(state, 'string', '')
      expect(set).to.not.throw()
      done()
    })
    it('should throw error if type is different from types property from object', function (done) {
      const state = new TestState()
      let vars = [true, '', 10]
      vars.forEach((value) => {
        const set = state.set.bind(state, 'object', value)
        expect(set).to.throw()
      })
      const set = state.set.bind(state, 'object', {})
      expect(set).to.not.throw()
      done()
    })

    it('should set proper types', (done) => {
      const state = new TestState()
      state.set('custom', 1)
      expect(state.get('custom') instanceof Custom).to.be.eql(true)
      done()
    })

    it('should set null', (done) => {
      const state = new TestState()
      state.set('custom', 1)
      state.set('custom', null)
      expect(state.get('custom')).to.be.null
      done()
    })

    it('should return this if set value by key', (done) => {
      const state = new TestState()
      const state2 = state.set('custom', 1)
      expect(state === state2).to.be.true
      done()
    })

    it('should return this if set values by object', (done) => {
      const state = new TestState()
      const state2 = state.setData({
        custom: '1',
        test: true,
      })
      expect(state === state2).to.be.true
      expect(state.get('test')).to.be.true
      done()
    })
  })

  describe('new', () => {
    it('should be equal if new created', function (done) {
      const state = new ReduxClass({
        boolean: true,
        string: 'string',
        number: 10,
      })
      const newState = state.new()
      expect(newState).to.be.eql(state)
      done()
    })

    it('should set created obj to new', function (done) {
      const state = new ReduxClass({})
      state.$setNotNew()
      const newState = state.new()
      expect(newState.isNew()).to.be.true
      done()
    })

    it('should create new instances on the path', function (done) {
      const state = new ReduxClass({
        inner1: new ReduxClass({
          inner2: new ReduxClass({
            inner3: new ReduxClass({
              boolean: false,
            }),
            x: 1,
          }),
          z: 2,
        }),
        y: 3,
      })
      state.$setNotNew()
      state.get('inner1').$setNotNew()
      state.get('inner1').get('inner2').$setNotNew()
      state.get('inner1').get('inner2').get('inner3').$setNotNew()
      const [target, root] = state.newPath('inner1.inner2.inner3')
      expect(root.isNew()).to.be.true
      expect(root.get('inner1').isNew()).to.be.true
      expect(root.get('inner1').get('inner2').isNew()).to.be.true
      expect(root.get('inner1').get('inner2').get('inner3').isNew()).to.be.true
      expect(target.isNew()).to.be.true
      done()
    })
  })



  describe('static', () => {
    describe('react propType', () => {
      it('should return null if proper ReduxClass object provided', (done) => {
        const prop = new ReduxClass()
        expect(ReduxClass.propType()({ prop }, 'prop', 'Component')).to.be.null
        done()
      })
      it('should return null if proper extended ReduxClass object provided', (done) => {
        class MyReduxClass extends ReduxClass { }
        const prop = new MyReduxClass()
        expect(ReduxClass.propType()({ prop }, 'prop', 'Component')).to.be.null
        expect(MyReduxClass.propType()({ prop }, 'prop', 'Component')).to.be.null
        done()
      })
      it('should return Error if extended ReduxClass object provided', (done) => {
        class MyReduxClass extends ReduxClass { }
        const prop = new ReduxClass()
        expect(MyReduxClass.propType()({ prop }, 'prop', 'Component') instanceof Error).to.be.true
        done()
      })
      it('should return Error for any other types', (done) => {
        expect(ReduxClass.propType()({ prop: null }, 'prop', 'Component') instanceof Error).to.be.true
        expect(ReduxClass.propType()({ prop: '' }, 'prop', 'Component') instanceof Error).to.be.true
        expect(ReduxClass.propType()({ prop: 1 }, 'prop', 'Component') instanceof Error).to.be.true
        expect(ReduxClass.propType()({ prop: true }, 'prop', 'Component') instanceof Error).to.be.true
        expect(ReduxClass.propType()({ prop: {} }, 'prop', 'Component') instanceof Error).to.be.true
        expect(ReduxClass.propType()({ prop: undefined }, 'prop', 'Component') instanceof Error).to.be.true
        done()
      })
    })

    describe('initDefaults', () => {
      class TestStateWithDefaults extends ReduxClass {
        static defaults = {
          custom: new Custom(),
          boolean: false,
          boolean2: true,
          string: 'string',
          object: { object: 'object' },
          number: 0,
          none: null,
        }
      }
      it('should set default values', (done) => {
        const state = new TestStateWithDefaults()
        expect(state.get('custom')).to.be.eql(new Custom())
        expect(state.get('boolean')).to.be.false
        expect(state.get('boolean2')).to.be.true
        expect(state.get('string')).to.be.eql('string')
        expect(state.get('object')).to.be.eql({ object: 'object' })
        expect(state.get('number')).to.be.eql(0)
        expect(state.get('none')).to.be.eql(null)
        done()
      })

      it('should set default only when property is undefined', (done) => {
        const state = new TestStateWithDefaults({ boolean2: false, object: null })
        expect(state.get('boolean2')).to.be.false
        expect(state.get('object')).to.be.null
        done()
      })

      it('should be able to set non-null value', (done) => {
        const state = new TestStateWithDefaults()
        state.set('none', 'string')
        expect(state.get('none')).to.be.eql('string')
        done()
      })

      it('should throw error', (done) => {
        class TestStateWithDefaultsAndTypes extends TestStateWithDefaults {
          static types = {
            number: 'boolean',
          }
        }
        const shouldThrow = () => {
          new TestStateWithDefaultsAndTypes()
        }
        expect(shouldThrow).to.throw
        done()
      })

    })
  })
  describe('initHiddenProperty', () => {
    it('should create hidden property', (done) => {
      class TestClass extends ReduxClass {
        constructor(...args: any[]) {
          super(...args)
          this._initHiddenProperty('hiddenProperty', true)
        }
      }
      const testObject = new TestClass()
      const descriptor = Object.getOwnPropertyDescriptor(testObject, 'hiddenProperty')
      expect(descriptor).to.be.deep.equal({
        value: true,
        writable: true,
        enumerable: false,
        configurable: false,
      })
      done()
    })
  })
})