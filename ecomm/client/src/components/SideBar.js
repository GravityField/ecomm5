import React, {Component} from "react"
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from '@mui/icons-material/Close';
import {ACCESS_LEVEL_ADMIN, ACCESS_LEVEL_NORMAL_USER, SERVER_HOST} from "../config/global_constants";
import {Link} from "react-router-dom";
import axios from "axios";

export default class SideBar extends Component
{
    constructor(props)
    {
        super(props)

        this.state = {
            email: "",
            user: null,
            displayState : false
        }
    }
    componentDidMount()
    {
        axios.get(`${SERVER_HOST}/users/${this.state.email}`)
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
                        console.log("Record read")
                        this.setState({user: res.data})
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
            <div >
                {!this.state.displayState ? <MenuIcon className="menu-icon" onClick={()=>this.setState({displayState: !this.state.displayState})} />
                    : <CloseIcon className="menu-icon" onClick={()=>this.setState({displayState: !this.state.displayState})} /> }
                {this.state.displayState ?
                    <div className="sidebar">
                    <ul onClick={()=>this.setState({displayState: !this.state.displayState})}>
                        <Link to={"/HomePage"}>Home</Link>
                        {localStorage.accessLevel >= ACCESS_LEVEL_NORMAL_USER ? <Link to={"/Account/" + this.state.user[0]._id}>Account</Link> : null}
                        {localStorage.accessLevel >= ACCESS_LEVEL_NORMAL_USER ?
                            <Link to={"/Logout"}>Logout</Link>
                            : <Link to={"/Login"}>Login</Link>
                        }
                        {localStorage.accessLevel >= ACCESS_LEVEL_ADMIN ?
                            <Link className="warning" to={"/DisplayAllUsers"}>Users</Link> : null
                        }
                        {localStorage.accessLevel >= ACCESS_LEVEL_ADMIN ?
                            <Link className="warning" to={"/ResetDatabase"}>Reset Database</Link> : null
                        }
                    </ul>
                </div> : null}
            </div>
        )
    }
}