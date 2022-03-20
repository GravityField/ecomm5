import {Link} from "react-router-dom";
import {ShoppingCart} from "@mui/icons-material";
import InventoryIcon from "@mui/icons-material/Inventory";
import SideBar from "./SideBar";
import React, {Component} from "react";
import {ACCESS_LEVEL_GUEST} from "../config/global_constants";

export default class Header extends Component {

    constructor(props)
    {
        super(props)

        this.state = {
            isLoggedIn: localStorage.accessLevel > ACCESS_LEVEL_GUEST
        }

    }

    render() {
        return (
        <nav>
            <Link to={"/DisplayAllProducts"} className="font-effect-fire">Shake&Bake</Link>

            <Link to={"/Cart"}><ShoppingCart className="shopping-icon"> </ShoppingCart></Link>

            <Link to={"/PurchaseHistory"}><InventoryIcon className="inventory-icon"> </InventoryIcon></Link>
            {
                this.state.isLoggedIn ?

                    localStorage.profilePhoto !== "undefined"
                    ? <img id="headerProfilePhoto" src={`data:;base64,${localStorage.profilePhoto}`} alt=""/>
                    : null
: null}


            <SideBar/>
        </nav>
        )
    }
}