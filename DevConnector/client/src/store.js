import {createStore,applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';



const initialState = {},
       middleware = [thunk],
       store = createStore(rootReducer,initialState,composeWithDevTools(applyMiddleware(...middleware)));

export default store;