import React, {Component} from "react"
import CartTableRow from "./CartTableRow"
import {ACCESS_LEVEL_GUEST} from "../../config/global_constants";
import BuyProduct from "../SalesComponents/BuyProduct";

let products;
export default class CartTable extends Component
{
    render()
    {
        return (
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Size</th>
                    <th>Color</th>
                    <th>Stock</th>
                    <th>Price</th>
                    <th/>
                    <th/>
                </tr>
                </thead>

                <tbody >
                {this.props.products.map((product) => <CartTableRow key={product._id} product={product}/>)}
                </tbody>
            </table>

        )
    }
}