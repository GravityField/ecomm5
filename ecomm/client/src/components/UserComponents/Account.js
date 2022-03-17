import React, {Component} from "react"
import {Redirect} from "react-router-dom"
import axios from "axios";
import {SERVER_HOST} from "../../config/global_constants";
import jwt from "jsonwebtoken";
// import Form from "react-bootstrap/Form"
//
// import axios from "axios"
//
// import LinkInClass from "../components/LinkInClass"
//
// import {SERVER_HOST} from "../config/global_constants"


export default class Account extends Component
{
    constructor(props)
    {
        super(props)

        this.state = {
            email:"",
            password:"",
            isLoggedIn:false
        }
    }


    componentDidMount()
    {
        const token2 = jwt.decode(localStorage.token,{algorithm: 'HS256'})
        console.log(token2)
        axios.get(`${SERVER_HOST}/users/${token2.id}`, {headers:{"authorization":localStorage.token}})
            .then(res => {
                    if (res.data) {
                        if (res.data.errorMessage) {
                            console.log(res.data.errorMessage)
                        } else {
                            console.log(res.data)
                            this.setState({
                                name: res.data.name,
                                email: res.data.email,
                                password: res.data.password
                            })
                        }
                    }
                    else
                    {
                        console.log("User data not returned")
                    }
                }
            )
    }
    render()
    {
        return (
            <div className="form-container">
                {this.state.redirectToDisplayAllProducts ? <Redirect to="/DisplayAllProducts"/> : null}



                <h1>Account</h1>
                {
                    localStorage.profilePhoto !== "null"
                        ? <img id="profilePhoto" src={`data:;base64,${localStorage.profilePhoto}`} alt=""/>
                        : null
                }
                <h2>{this.state.name}</h2>
                <h3>{this.state.email}</h3>
                <h4>{this.state.password}</h4>



                


            </div>
        )
    }
}