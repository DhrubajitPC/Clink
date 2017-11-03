import {
	UPDATE_LEADS,
	UPDATE_USER,
} from './constants';

export const updateLeads = (leads) => {
	return {
		type: UPDATE_LEADS,
		payload: {
			leads,
		},
	};
};

export const updateUser = (user) => {
	return {
		type: UPDATE_USER,
		payload: {
			user,
		},
	};
};
