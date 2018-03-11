// The Symbol used to tag the ReduxClass type. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.

var REDUX_CLASS_TYPE = typeof Symbol === 'function' && Symbol['for'] && Symbol['for']('redux-class.class') || 0xfcc9

module.exports = REDUX_CLASS_TYPE