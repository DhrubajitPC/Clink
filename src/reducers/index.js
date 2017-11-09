import { combineReducers } from 'redux';
import user from './user';
import leads from './leads';

export default combineReducers({
    user,
    leads,
});
