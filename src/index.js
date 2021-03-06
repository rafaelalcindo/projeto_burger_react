import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import axios from 'axios';
import burgerBuilderReducer from './store/reducers/burgerBuilder';

axios.interceptors.request.use(request => {
    console.log(request);
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(burgerBuilderReducer, composeEnhancers(
    applyMiddleware(thunk)
) );

const app = (
    <Provider store={store} >
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>    
);

ReactDOM.render( app, document.getElementById('root'));
registerServiceWorker();
