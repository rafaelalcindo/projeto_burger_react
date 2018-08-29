import React, { Component } from 'react';

import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner  from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import firebase from "firebase";


const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }
    config = undefined;
    constructor() {
        super();
        this.config = {
            apiKey: "AIzaSyBqqmsbl7_nPQgrdSCXmLPv4dOZyg5kXm8",
            authDomain: "react-my-burger-bd745.firebaseapp.com",
            databaseURL: "https://react-my-burger-bd745.firebaseio.com",
            projectId: "react-my-burger-bd745",
            storageBucket: "react-my-burger-bd745.appspot.com",
            messagingSenderId: "509932533810"
          };
        
    }   

    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount () {
        // axios.get('https://react-my-burger-bd745.firebaseio.com/ingredients')
        //     .then(response => {
        //         this.setState({ingredients: response.data});
        //     })
              //.catch(error => { this.setState({ error: true }) });
        firebase.initializeApp(this.config);
        firebase.database().ref('/ingredients').once('value')
            .then(resposta => {
                console.log('Resposta Server: ', resposta.val());    
                this.setState({ingredients: resposta.val()});
            })
            .catch( () => this.setState({ error: true }) );
    }

    updatePurchaseState (ingredients) {
        const sum = Object.keys( ingredients )
            .map( igKey => {
                return ingredients[igKey];
            } )
            .reduce( ( sum, el ) => {
                return sum + el;
            }, 0 );
        this.setState( { purchasable: sum > 0 } );
    }

    addIngredientHandler = ( type ) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState( { totalPrice: newPrice, ingredients: updatedIngredients } );
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = ( type ) => {
        const oldCount = this.state.ingredients[type];
        if ( oldCount <= 0 ) {
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState( { totalPrice: newPrice, ingredients: updatedIngredients } );
        this.updatePurchaseState(updatedIngredients);
    }

    purchaseHandler = () => {
        this.setState({ purchasing: true });
        console.log('entrou');
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    }

    purchaseContinueHandler = () => {
        //alert('You Continue!');
        // this.setState({ loading: true })
        // const order = {
        //     ingredients: this.state.ingredients,
        //     price: this.state.totalPrice,
        //     customer: {
        //         name: 'Rafael Alcindo',
        //         address: {
        //             street: 'Rua Modelar 310',
        //             zipCode: '05868-790',
        //             country: 'Brasil'
        //         },
        //         email: 'rafael.alcindo@gmail.com'
        //     },
        //     deliveryMoethod: 'fastest'
        // }
        // axios.post('/orders.json', order)
        //     .then(response => {
        //         this.setState({ loading: false, purchasing: false })
        //     })
        //     .catch(error => this.setState({ loading: false, purchasing: false }) );
        const queryParams = [];
        for(let i in this.state.ingredients) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i] ));
        }
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/checkout',
            search: '?'+ queryString
        });
    }

    render () {
        const disabledInfo = {
            ...this.state.ingredients
        };
        for ( let key in disabledInfo ) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredients can´t be loaded!</p> : <Spinner />

        if(this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        purchasable={this.state.purchasable}
                        ordered={this.purchaseHandler}
                        price={this.state.totalPrice} />
                </Aux>
            );

            orderSummary = <OrderSummary 
            ingredients={ this.state.ingredients } 
            price={this.state.totalPrice}
            purchaseCanceled={this.purchaseCancelHandler} 
            purchaseContinued={this.purchaseContinueHandler} />
        }

        

        if(this.state.loading){
            orderSummary = <Spinner />;
        }
        
        // {salad: true, meat: false, ...}
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={ this.purchaseCancelHandler } >
                   { orderSummary }
                </Modal>
                { burger }
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);