import React, {Component} from "react"
import {Redirect} from "react-router-dom"
import axios from "axios"

import {SERVER_HOST} from "../../config/global_constants"
import jwt from "jsonwebtoken";


export default class DeleteCart extends Component
{
    constructor(props) 
    {
        super(props)
        
        this.state = {
            redirectToCart:false
        }
    }
    
    
    componentDidMount() 
    {
        const token2 = jwt.decode(localStorage.token, {algorithm: 'HS256'})
        axios.delete(`${SERVER_HOST}/users/${token2.id}/cart/${this.props.match.params._id}`)
            .then(res => {
                this.setState({redirectToCart: true})
                console.log("Removed from Cart")
            })
    }
  
  
    render() 
    {
        return (
            <div>   
                {this.state.redirectToCart ? <Redirect to="/Cart"/> : null}
            </div>
        )
    }
}