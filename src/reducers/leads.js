import {
  ADD_USER_TO_LEADS,
  REMOVE_USER_FROM_LEADS,
} from '../constants';

const initialState = {};

export default function reducer (state = initialState, action = {}){
  switch (action.type) {
    case ADD_USER_TO_LEADS:
      const user = action.payload;
      return {
        ...state,
        user,
      };

    case REMOVE_USER_FROM_LEADS:
      const leads = Object.assign({}, state);
      const user = actions.payload;
      delete leads[user.uid];
      return leads;

    default:
      return state;
  }
}
