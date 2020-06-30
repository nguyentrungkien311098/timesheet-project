import constants from '@strings'
import clientUtils from '@utils/client-utils';

const reducer = (state = {}, action) => {
	let newState = { ...state }
	switch (action.type) {
		case 'HOME-TIME-SHEET-UPDATE-DATA':
			newState = { ...state, ...action.data || {} }
			return newState;
		default:
			return state
	}

}
export default reducer
