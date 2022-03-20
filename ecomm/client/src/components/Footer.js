import React, {Component} from "react"
import {Link} from "react-router-dom";


export default class Footer extends Component
{
    constructor(props)
    {
        super(props)

    }
    render()
    {

        return (
            <div className="footer-container">
                <div className="footer">
                <ul>
                    <li><h2>Information</h2></li>
                    <li><h6>Address:</h6>The Bog, Monaghan</li>
                    <li><h6>Telephone:</h6> 0877741374</li>
                    <li><h6>Email:</h6> nathanfield32@gmail.com</li>
                </ul>
                <ul>
                    <li><h2>Menu</h2></li>
                    <Link to={"/HomePage"}>Home</Link>
                    <Link to={"/DisplayAllProducts"}>Products</Link>
                </ul>
                <ul>
                    <li><h2>Account</h2></li>
                    <Link to={"/Login"}>Login</Link>
                    <Link className={"register-text"} to={"/Register"}>Register</Link>
                </ul>


                </div>
                <p>© 2022 Nathan Field</p>
            </div>
        )
    }
}