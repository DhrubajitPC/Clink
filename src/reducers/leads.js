import {
  ADD_USER_TO_LEADS,
  REMOVE_USER_FROM_LEADS,
} from '../constants';

const initialState = {};

export default function reducer (state = initialState, action = {}){
  let user = {};
  switch (action.type) {
    case ADD_USER_TO_LEADS:
      user = action.payload.user;
      const newState = Object.assign({}, state, user);
      return newState;

    case REMOVE_USER_FROM_LEADS:
      const leads = Object.assign({}, state);
      user = actions.payload.user;
      delete leads[user.uid];
      return leads;

    default:
      return state;
  }
}
