import {
	UPDATE_LEADS,
	UPDATE_USER,
} from '../constants';

const initialState = {
	firstName: '',
	lastName: '',
	email: '',
	contactNumber: '',
	companyName: '',
	companyPosition: '',
	qrCode: '',
	leads: {},
	uid: '',
};

export default function reducer(state = initialState, action = {}){

	switch (action.type){

		case UPDATE_LEADS:
			const lead = action.payload.lead;
			return {
				...state,
				leads: Object.assign({}, state.leads, lead),
			};

		case UPDATE_USER:
			const user = action.payload.user;
			return Object.assign({}, state, user);

		default:
			return state;

	}

}
