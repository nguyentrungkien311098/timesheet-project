import { combineReducers } from 'redux'
import auth from './auth'
import timesheet from './timesheet'
import product from './product'
import project from './project'
import job from './job'

export default combineReducers({
	auth,
	timesheet,
	product,
	project,
	job
})