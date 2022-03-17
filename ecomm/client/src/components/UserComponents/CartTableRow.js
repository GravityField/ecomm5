import React, {Component} from "react"
import {Link} from "react-router-dom"

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    ACCESS_LEVEL_ADMIN,
    ACCESS_LEVEL_GUEST,
    ACCESS_LEVEL_NORMAL_USER,
    SERVER_HOST
} from "../../config/global_constants";
import BuyProduct from "../SalesComponents/BuyProduct";
import axios from "axios";
import jwt from "jsonwebtoken";

export default class CartTableRow extends Component {

    constructor(props) {
        super(props)


        this.state = {
            email: ""
        }
    }

    componentDidMount() {
        this.props.product.productImages.map(photo => {
            return axios.get(`${SERVER_HOST}/product/photo/${photo.filename}`)
                .then(res => {
                    if (res.data) {
                        if (res.data.errorMessage) {
                            console.log(res.data.errorMessage)
                        } else {
                            document.getElementById(photo._id).src = `data:;base64,${res.data.image}`
                        }
                    } else {
                        console.log("Record not found")
                    }
                })
                .catch(error => {

                        console.log(error)
                    }
                )
        })
    }

    handleSubmit = (e) => {
        const token2 = jwt.decode(localStorage.token, {algorithm: 'HS256'})
        axios.delete(`${SERVER_HOST}/users/${token2.id}/cart/${this.props.product._id}`)
            .then(res => {
                console.log("Removed from Cart")
            })

    }

    render() {
        let soldOrForSale = null
        if (localStorage.accessLevel >= ACCESS_LEVEL_GUEST) {
            if (this.props.product.sold !== true) {
                soldOrForSale = <BuyProduct productID={this.props.product._id} price={this.props.product.price}/>
            } else {
                soldOrForSale = "SOLD"
            }
        }

        return (
            <tr>
                <td><Link
                    to={"/DisplayProductDetails/" + this.props.product._id}>{this.props.product.productName}</Link></td>
                <td>{this.props.product.size}</td>
                <td>{this.props.product.color}</td>
                <td>{this.props.product.stockLevel}</td>
                <td>€{this.props.product.price}</td>
                <td className="productPhotos">
                    {this.props.product.productImages !== null ? this.props.product.productImages.map(photo => <img
                        key={photo._id} id={photo._id} alt=""/>) : null}
                </td>
                <td>{soldOrForSale}</td>
                <td>
                    {localStorage.accessLevel >= ACCESS_LEVEL_NORMAL_USER ?
                        <Link className="delete-button"
                              to={"/Cart"} onClick={this.handleSubmit}><DeleteIcon/></Link>
                        : null}

                </td>
            </tr>
        )
    }
}