import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

import firebase from "firebase";

 var config = {
    apiKey: "AIzaSyBqqmsbl7_nPQgrdSCXmLPv4dOZyg5kXm8",
    authDomain: "react-my-burger-bd745.firebaseapp.com",
    databaseURL: "https://react-my-burger-bd745.firebaseio.com",
    projectId: "react-my-burger-bd745",
    storageBucket: "react-my-burger-bd745.appspot.com",
    messagingSenderId: "509932533810"
  };

firebase.initializeApp(config);

export const addIngredient = (name) => {
    return {
        type: actionTypes.ADD_INGREDIENTS,
        ingredientName: name
    };    
};

export const removeIngredient = (name) => {
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        ingredientName: name
    };    
};

export const setIngredients = (ingredients) => {
    return {
        type: actionTypes.SET_INGREDIENTS,
        ingredients: ingredients
    };
}

export const fetchIngredientsFailed = () =>{
    return {
        type: actionTypes.FETCH_INGREDIENTS_FAILED
    }
};

export const initIngredients = () => {

    return dispatch => {    
        axios.get('https://react-my-burger-bd745.firebaseio.com/ingredients.json')
            .then(response => {
                dispatch(setIngredients(response.data))
            }).catch(error => { dispatch(fetchIngredientsFailed()); });
        
        // firebase.database().ref('/ingredients').once('value')
        //     .then(resposta => {
        //         console.log('Resposta Server: ', resposta.val());    
        //         dispatch(setIngredients(resposta.val()))
        //     }).catch( () => dispatch(fetchIngredientsFailed() ) );
    };
};