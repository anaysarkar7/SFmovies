import {combineReducers} from 'redux';
import filterReducer from './reducers/reducers';

const rootReducer=combineReducers({
    store: filterReducer,
});

export default rootReducer;