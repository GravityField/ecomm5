import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom"
import axios from "axios"

import LinkInClass from "../LinkInClass"
import {SERVER_HOST} from "../../config/global_constants"


export default class Login extends Component
{
    constructor(props)
    {
        super(props)

        this.state = {
            email:"",
            password:"",
            isLoggedIn:false,
            wasSubmittedAtLeastOnce: false
        }
    }


    handleChange = (e) =>
    {
        this.setState({[e.target.name]: e.target.value})
    }


    handleSubmit = (e) =>
    {

        this.setState({wasSubmittedAtLeastOnce: true});

        axios.post(`${SERVER_HOST}/users/login/${this.state.email}/${this.state.password}`)
            .then(res =>
            {

                if(res.data)
                {
                    if (res.data.errorMessage)
                    {
                        console.log(res.data.errorMessage)
                    }
                    else // user successfully logged in
                    {
                        console.log("User logged in")

                        localStorage.name = res.data.name
                        localStorage.accessLevel = res.data.accessLevel
                        if(localStorage.profilePhoto !== "undefined"){
                        localStorage.profilePhoto = res.data.profilePhoto
                        }
                        localStorage.token = res.data.token
                        this.setState({isLoggedIn:true})
                    }
                }
                else
                {
                    console.log("Login failed")
                }
            })
    }


    render()
    {
        let errorMessage = "";
        if(this.state.wasSubmittedAtLeastOnce)
        {
            errorMessage = <div className="error">Login Details are incorrect<br/></div>;
        }

        return (
            <form className="form-container" noValidate = {true} id = "loginOrRegistrationForm">
                <h2>Login</h2>

                {this.state.isLoggedIn ? <Redirect to="/DisplayAllProducts"/> : null}

                <input
                    type = "email"
                    name = "email"
                    placeholder = "Email"
                    autoComplete="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                /><br/>

                <input
                    type = "password"
                    name = "password"
                    placeholder = "Password"
                    autoComplete="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                /><br/>
                <div>
                    {errorMessage}
                    <br/>
                <Link className={"register-text"} to={"/Register"}>Don't have an account? Register here</Link>
                    <br/><br/>
                    <Link className={"guest"} to={"/DisplayAllProducts"} onClick={()=>localStorage.clear()}>Continue as a Guest</Link>
                </div>
                <br/>




                <LinkInClass value="Login" className="green-button" onClick={this.handleSubmit}/>
                {/*<Link className="red-button" to={"/DisplayAllProducts"}>Cancel</Link>*/}
            </form>
        )
    }
}
