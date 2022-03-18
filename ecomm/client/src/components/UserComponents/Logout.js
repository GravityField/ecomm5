import React, {Component} from "react"
import {Redirect} from "react-router-dom"
import axios from "axios"

import LinkInClass from "../LinkInClass"
import {SERVER_HOST} from "../../config/global_constants"


export default class Logout extends Component
{
    constructor(props)
    {
        super(props)

        this.state = {
            isLoggedIn:true
        }
    }


    handleSubmit = (e) =>
    {
        e.preventDefault()

        axios.post(`${SERVER_HOST}/users/logout`)
            .then(res =>
            {
                if(res.data)
                {
                    if (res.data.errorMessage)
                    {
                        console.log(res.data.errorMessage)
                    }
                    else
                    {
                        console.log("User logged out")
                        localStorage.clear()

                        this.setState({isLoggedIn:false})
                    }
                }
                else
                {
                    console.log("Logout failed")
                }
            })
    }


    render()
    {
        return (
            <div className={"form-container"}>

                {!this.state.isLoggedIn ? <Redirect to="/DisplayAllProducts"/> : null}
                <h2>Are you sure you want to Logout?</h2>
                <LinkInClass value="Log out" className="cancel-button" onClick={this.handleSubmit}/>
            </div>
        )
    }
}