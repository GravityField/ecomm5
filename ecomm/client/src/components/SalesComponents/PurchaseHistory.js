import React, {Component} from "react"
import {Redirect} from "react-router-dom"
import axios from "axios";
import {SERVER_HOST} from "../../config/global_constants";
import SaleTableRow from "./SaleTableRow";
// import Form from "react-bootstrap/Form"
//
// import axios from "axios"
//
// import LinkInClass from "../components/LinkInClass"
//
// import {SERVER_HOST} from "../config/global_constants"


export default class PurchaseHistory extends Component
{
    constructor(props)
    {
        super(props)

        this.state = {
            email:"",
            sales:[],
            productName: "",
            productDescription: "",
            color: "",
            stockLevel: "",
            price: "",
            productImages: [],
            redirectToDisplayAllProducts:false
        }
    }


    componentDidMount()
    {
        axios.get(`${SERVER_HOST}/users/${this.state.email}`, {headers:{"authorization":localStorage.token}})
            .then(res => {

                    if (res.data) {
                        if (res.data.errorMessage) {
                            console.log(res.data.errorMessage)
                        } else {
                            console.log(res.data)
                            this.setState({
                                email: res.data[0].email

                            })
                            axios.get(`${SERVER_HOST}/sales/${this.state.email}`, {headers:{"authorization":localStorage.token}})
                                .then(res => {
                                        if (res.data) {
                                            if (res.data.errorMessage) {
                                                console.log(res.data.errorMessage)
                                            } else {
                                                console.log(res.data)
                                                this.setState({
                                                    sales: res.data
                                                })
                                            }
                                        }
                                        else
                                        {
                                            console.log("User data not returned")
                                        }
                                    }
                                )
                        }
                    }
                    else
                    {
                        console.log("User data not returned")
                    }
                }
            )
    }

    handleChange = (e) =>
    {
        this.setState({[e.target.name]: e.target.value})
    }

    handleSubmit = (e) => {


    }


    render()
    {
        return (
            <div className="form-container">
                {this.state.redirectToDisplayAllProducts ? <Redirect to="/DisplayAllProducts"/> : null}

                <h1>Purchase History</h1>
                <h2>{this.state.email}</h2>
<table className="salesTable">
    <thead><tr>
    <th>Paypal ID</th>
        <th>Product ID</th>
        <th>Price</th>
    </tr>
    </thead>
    <tbody>
    {this.state.sales.map(sale => <SaleTableRow key={sale._id} sale={sale} >{sale.paymentID}</SaleTableRow>)}
    </tbody>
</table>

            </div>
        )
    }
}