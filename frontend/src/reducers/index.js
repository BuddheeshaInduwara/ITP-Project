import { combineReducers } from 'redux'
import alert from './alert'
import auth from './auth'
import profile from './profile'
import cart from './cart'
import products from './products'
import advertisments from './advertisments'

export default combineReducers({
  alert,
  auth,
  profile,
  cart,
  products,
  advertisments,
})
