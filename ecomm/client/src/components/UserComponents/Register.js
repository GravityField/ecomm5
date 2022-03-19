import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom"
import axios from "axios"

import LinkInClass from "../LinkInClass"

import {SERVER_HOST} from "../../config/global_constants"


export default class Register extends Component
{
    constructor(props)
    {
        super(props)

        this.state = {
            name:"",
            email:"",
            password:"",
            confirmPassword:"",
            selectedFile:null,
            wasSubmittedAtLeastOnce: false,
            isRegistered:false
        }
    }


    handleChange = (e) =>
    {
        this.setState({[e.target.name]: e.target.value})
    }
    handleFileChange = (e) =>
    {
        this.setState({selectedFile: e.target.files[0]})

    }


    handleSubmit = (e) => {
        e.preventDefault()

        this.setState({wasSubmittedAtLeastOnce: true});
console.log("Here Submitted")
        const formInputsState = this.validate();
        console.log(formInputsState)
        let formData = new FormData()

        if (Object.keys(formInputsState).every(index => formInputsState[index])) {

            if(this.state.selectedFile) {
                formData.append("profilePhoto", this.state.selectedFile)
            }
            axios.post(`${SERVER_HOST}/users/register/${this.state.name}/${this.state.email}/${this.state.password}`, formData, {headers: {"Content-type": "multipart/form-data"}})
                .then(res => {

                    if (res.data) {
                        if (res.data.errorMessage) {
                            alert(res.data.errorMessage)
                        } else // user successfully registered
                        {
                            console.log("User registered")
                            localStorage.name = res.data.name
                            localStorage.accessLevel = res.data.accessLevel
                            localStorage.profilePhoto = res.data.profilePhoto
                            localStorage.token = res.data.token
                            this.setState({isRegistered: true})
                        }
                    } else {
                        console.log("Registration failed")
                    }
                })
        }
    }

    validateName()
    {
        const pattern = /^[A-Za-z]+$/;
        return pattern.test(String(this.state.name).toLowerCase())
    }

    validateEmail()
    {

        const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(String(this.state.email).toLowerCase())
    }


    validatePassword()
    {
        const pattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
        return pattern.test(String(this.state.password))
    }


    validateConfirmPassword()
    {
        return ((this.state.confirmPassword.length > 0) && (this.state.password === this.state.confirmPassword))
    }


    validate()
    {
        return{
            name: this.validateName(),
            email: this.validateEmail(),
            password: this.validatePassword(),
            confirmPassword: this.validateConfirmPassword()
        }
    }
    render()
    {
        const formInputsState = this.validate()
        const inputsAreAllValid = Object.keys(formInputsState).every(index => formInputsState[index])

        let emailErrorMessage = ""
        let passwordErrorMessage = ""
        let confirmPasswordErrorMessage = ""

        if(!this.validateEmail())
        {
            emailErrorMessage = <div className="error">Enter a valid email<br/></div>
        }

        if(!this.validatePassword())
        {
            let errorMessages = []
            if(this.state.password.length < 10)
            {
                errorMessages.push({id:0, text:"Password must be at least ten characters long."})
            }
            if(!this.state.password.match(/[0-9]/))
            {
                errorMessages.push({id:1, text:"Password must contain at least one digit (0-9)."})
            }
            if(!this.state.password.match(/[a-z]/))
            {
                errorMessages.push({id:2, text:"Password must contain at least one lowercase character."})
            }
            if(!this.state.password.match(/[A-Z]/))
            {
                errorMessages.push({id:3, text:"Password must contain at least one uppercase character.{'\n''}"})
            }
            if(!this.state.password.match(/[£!#€$%^&*]/))
            {
                errorMessages.push({id:4, text:"Password must contain at least one of the characters £!#€$%^&*"})
            }
            passwordErrorMessage = <div className="error"><ul>{errorMessages.map(errorMessage => <li key={errorMessage.id}> {errorMessage.text} </li>)}</ul></div>
        }

        if(!this.validateConfirmPassword())
        {
            confirmPasswordErrorMessage = <div className="error">Passwords must match<br/></div>
        }
        return (
            <form className="form-container" noValidate = {true} id = "loginOrRegistrationForm">

                {this.state.isRegistered ? <Redirect to="/DisplayAllProducts"/> : null}

                <h2>New User Registration</h2>

                <input
                    name = "name"
                    type = "text"
                    placeholder = "Name"
                    autoComplete="name"
                    value = {this.state.name}
                    onChange = {this.handleChange}
                    ref = {(input) => { this.inputToFocus = input }}
                /><br/>

                <input
                    name = "email"
                    type = "email"
                    placeholder = "Email"
                    autoComplete="email"
                    value = {this.state.email}
                    onChange = {this.handleChange}
                /><br/>
                {this.state.wasSubmittedAtLeastOnce ? emailErrorMessage : null}


                <input
                    name = "password"
                    type = "password"
                    placeholder = "Password"
                    autoComplete="password"
                    title = "Password must be at least ten-digits long and contains at least one lowercase letter, one uppercase letter, one digit and one of the following characters (£!#€$%^&*)"
                    value = {this.state.password}
                    onChange = {this.handleChange}
                /><br/>
                {this.state.wasSubmittedAtLeastOnce ? passwordErrorMessage : null}

                <input
                    name = "confirmPassword"
                    type = "password"
                    placeholder = "Confirm password"
                    autoComplete="confirmPassword"
                    value = {this.state.confirmPassword}
                    onChange = {this.handleChange}
                /><br/><br/>
                {this.state.wasSubmittedAtLeastOnce ? confirmPasswordErrorMessage : null}
                <input
                    type = "file"
                    onChange = {this.handleFileChange}
                />
                <br/>
                <LinkInClass value="Register New User" className="add-button" onClick={this.handleSubmit} />
                <Link className="cancel-button" to={"/Login"}>Cancel</Link>
            </form>
        )
    }
}
