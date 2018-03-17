import { expect } from 'chai'
import ReduxClass from '../ReduxClass.class'

describe('ReduxClass.class', function () {

  class Custom {

  }

  class TestReducer extends ReduxClass {
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
      const state = new TestReducer()
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
      const state = new TestReducer()
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
      const state = new TestReducer()
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
      const state = new TestReducer()
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
      const state = new TestReducer()
      state.set('custom', 1)
      expect(state.get('custom') instanceof Custom).to.be.eql(true)
      done()
    })

    it('should set null', (done) => {
      const state = new TestReducer()
      state.set('custom', 1)
      state.set('custom', null)
      expect(state.get('custom')).to.be.null
      done()
    })

    it('should return this if set value by key', (done) => {
      const state = new TestReducer()
      const state2 = state.set('custom', 1)
      expect(state === state2).to.be.true
      done()
    })

    it('should return this if set values by object', (done) => {
      const state = new TestReducer()
      const state2 = state.set({
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
      const [target, root] = state.new('inner1.inner2.inner3')
      expect(root.isNew()).to.be.true
      expect(root.get('inner1').isNew()).to.be.true
      expect(root.get('inner1').get('inner2').isNew()).to.be.true
      expect(root.get('inner1').get('inner2').get('inner3').isNew()).to.be.true
      expect(target.isNew()).to.be.true
      done()
    })
  })



  describe('static', () => {
    describe('privateProperties', () => {
      it('should have proper private properties', (done) => {
        const privateProperties = ReduxClass.privateProperties
        expect(privateProperties.indexOf('$$new')).to.not.be.equal(-1)
        expect(privateProperties.indexOf('$$typeof')).to.not.be.equal(-1)
        done()
      })
    })
  })
})