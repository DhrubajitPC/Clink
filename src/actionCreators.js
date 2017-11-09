import {
	UPDATE_LEADS,
	UPDATE_USER,
  ADD_USER_TO_LEADS,
  REMOVE_USER_FROM_LEADS,
} from './constants';

export const updateLeads = (lead) => {
	return {
		type: UPDATE_LEADS,
		payload: {
			lead,
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

export const addUserToLeads = (user) => {
  return {
    type: ADD_USER_TO_LEADS,
    payload: {
      user,
    }
  }
};

export const removeUserFromLeads = (user) => {
  return {
    type: REMOVE_USER_FROM_LEADS,
    payload: {
      user,
    }
  }
};
