import React, {Component} from "react"
import {Redirect} from "react-router-dom"
import axios from "axios";
import {ACCESS_LEVEL_GUEST, SERVER_HOST} from "../../config/global_constants";
import ProductTableRow from "../ProductComponents/ProductTableRow";
import CartTable from "./CartTable";
import BuyProduct from "../SalesComponents/BuyProduct";
import jwt from "jsonwebtoken";


export default class Cart extends Component
{
    constructor(props)
    {
        super(props)

        this.state = {
            email: "",
            cart: [],
            productName: "",
            productDescription: "",
            color: "",
            stockLevel: "",
            price: "",
            productImages: [],
            redirectToDisplayAllProducts:false
        }
    }


    componentDidMount()
    {
        const token2 = jwt.decode(localStorage.token,{algorithm: 'HS256'})
        if(localStorage.accessLevel > ACCESS_LEVEL_GUEST) {
            axios.get(`${SERVER_HOST}/users/${token2.id}`, {headers: {"authorization": localStorage.token}})
                .then(res => {
                        console.log(res.data)
                        if (res.data) {
                            if (res.data.errorMessage) {
                                console.log(res.data.errorMessage)
                            } else {
                                console.log(res.data)
                                if (res.data.cart != null) {
                                    this.setState({
                                        cart: res.data.cart
                                    })
                                }
                            }
                        } else {
                            console.log("User data not returned")
                        }
                    }
                )
        }
    }

    render()
    {

        let total = 0;
        this.state.cart.map(product=>{
            total += product.price
        })
        console.log(total)

        return (
            <div className="form-container">
                {this.state.redirectToDisplayAllProducts ? <Redirect to="/DisplayAllProducts"/> : null}



                <h1>Basket</h1>

                <CartTable products={this.state.cart}/>
                <BuyProduct productID={this.state.cart.map(product => product._id)} price={total} />


            </div>
        )
    }
}