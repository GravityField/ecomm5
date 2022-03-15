import {Link} from "react-router-dom";
import {ShoppingCart} from "@mui/icons-material";
import InventoryIcon from "@mui/icons-material/Inventory";
import SideBar from "./SideBar";
import React, {Component} from "react";
import axios from "axios";
import {SERVER_HOST} from "../config/global_constants";

export default class Header extends Component {


    render() {
        return (
        <nav>
            <Link to={"/DisplayAllProducts"} className="font-effect-fire">Hoodies.ie</Link>

            <Link to={"/Cart"}><ShoppingCart className="shopping-icon"> </ShoppingCart></Link>
            <Link to={"/PurchaseHistory"}><InventoryIcon className="inventory-icon"> </InventoryIcon></Link>

            <SideBar/>
        </nav>
        )
    }
}