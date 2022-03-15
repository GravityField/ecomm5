import React, {Component} from "react"
import axios from "axios"

import {SERVER_HOST} from "../../config/global_constants"
import UserTable from "./UserTable";




export default class DisplayAllUsers extends Component
{
    constructor(props)
    {
        super(props)

        this.state = {
            users:[]
        }
    }


    componentDidMount()
    {
        axios.get(`${SERVER_HOST}/users`)
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
                        console.log("Records read")
                        this.setState({users: res.data})
                    }
                }
                else
                {
                    console.log("Record not found")
                }
            })
    }

    render()
    {
        return (
            <div className="form-container">
                <div className="table-container">

                    <UserTable users={this.state.users} />


                </div>
            </div>

        )
    }
}