import constants from '@strings'
import clientUtils from '@utils/client-utils';

const reducer = (state = {}, action) => {
	let newState = { ...state }
	switch (action.type) {
		case 'AUTH-UPDATE-DATA':
			newState = { ...state, ...action.data || {} }
			return newState;
		case 'persist/REHYDRATE':
			if (action.payload && action.payload.auth && Object.keys(action.payload.auth).length)
				clientUtils.auth = ((action.payload.auth || {}).auth || {}).loginToken || "";
		default:
			return state
	}

}
export default reducer
