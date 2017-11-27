import { combineReducers } from 'redux'
import counter from './counter';

const appStore = combineReducers({
  counter
})

export default appStore