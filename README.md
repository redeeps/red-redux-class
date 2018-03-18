# red-redux-class

## Project assumptions

- Keep immutability
- Allow deep object nesting
- Favor composition in reducers
- Easy apply to a single reducer or whole project

## Install

    npm install --save red-redux-class

## Usage

### Base whole project on ReduxClass

Replace redux "combineReducers" with "combineReduxClassReducers" in your reducers.js file.

    import { combineReduxClassReducers } from 'red-redux-class'

    import yourReducer from './yourReducer'

    const rootReducer = combineReduxClassReducers({
      yourReducer: yourReducer,
    })

    export default rootReducer

### Use for single reducer

In yourReducer.js file import only a wrapper

    import { ReduxClassWrapper } from 'red-redux-class'    

    function yourReducer(state = {}, action) {
      ...
    }

    export default ReduxClassWrapper(yourReducer)

### Extend your redux object 

#### File: YourReduxClass.js

In your class file, extend the class with ReduxClass.

     import { ReduxClass } from 'red-redux-class'

     class YourReduxClass extends ReduxClass {
       constructor(initialState) {
         super(initialState)
       }

       setAppName(appName) {
         this.set('appName', appName)
       }

       getAppName() {
         return this.appName
       }
     }

     export default YourReduxClass

#### File: yourReducer.js

User your YourReduxClass object as initial state for your reducer. 
For every change in state create new state using new().
  
    import { ReduxClassWrapper } from 'red-redux-class'    
    import YourReduxClass from './YourReduxClass'

    const initialState = new YourReduxClass({
      appName: 'App name',
    })

    function yourReducer(state = initialState, action) {
      ...
        const newState = state.new()
        newState.setAppName('My app')
        return newState
      ...
    }

    export default ReduxClassWrapper(yourReducer)