import React, {Component} from "react"
import Form from "react-bootstrap/Form"
import {Redirect, Link} from "react-router-dom"
import axios from "axios"

import LinkInClass from "../LinkInClass"

import {ACCESS_LEVEL_NORMAL_USER, SERVER_HOST} from "../../config/global_constants"

export default class EditProduct extends Component {
    constructor(props) {
        super(props)

        this.state = {
            productName: "",
            size: "",
            color: "",
            stockLevel: "",
            price: "",
            selectedFiles: null,
            productImages: [],
            wasSubmittedAtLeastOnce: false,
            redirectToDisplayAllProducts: localStorage.accessLevel < ACCESS_LEVEL_NORMAL_USER
        }
    }

    componentDidMount() {
        this.inputToFocus.focus()

        axios.get(`${SERVER_HOST}/products/${this.props.match.params.id}`, {headers: {"authorization": localStorage.token}})
            .then(res => {
                if (res.data) {
                    if (res.data.errorMessage) {
                        console.log(res.data.errorMessage)
                    } else {
                        this.setState({
                            productName: res.data.productName,
                            size: res.data.size,
                            color: res.data.color,
                            stockLevel: res.data.stockLevel,
                            price: res.data.price,
                            productImages: res.data.productImages
                        })
                        this.state.productImages.map(photo => {
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
                } else {
                    console.log(`Record not found`)
                }
            })
    }


    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    handleFileChange = (e) => {
        this.setState({selectedFiles: e.target.files})

    }
    handleSubmit = (e) => {
        e.preventDefault()

        this.setState({wasSubmittedAtLeastOnce: true});

        const formInputsState = this.validate();

        let formData = new FormData()
        if (Object.keys(formInputsState).every(index => formInputsState[index])) {

            formData.append("productName", this.state.productName)
            formData.append("size", this.state.size)
            formData.append("color", this.state.color)
            formData.append("stockLevel", this.state.stockLevel)
            formData.append("price", this.state.price)

            if (this.state.selectedFiles) {
                console.log("State true")
                for (let i = 0; i < this.state.selectedFiles.length; i++) {
                    formData.append("productImages", this.state.selectedFiles[i])
                }
            }
        }
        axios.put(`${SERVER_HOST}/products/${this.props.match.params.id}`, formData, {
            headers: {
                "authorization": localStorage.token,
                "Content-type": "multipart/form-data"
            }
        })
            .then(res => {
                if (res.data) {
                    if (res.data.errorMessage) {
                        console.log(res.data.errorMessage)
                    } else {
                        console.log(`Record updated`)
                        this.setState({redirectToDisplayAllProducts: true})
                    }
                } else {
                    console.log(`Record not updated`)
                }
            })
    }

    validateName() {
        const pattern = /^[a-zA-Z- '0-9]+$/
        return pattern.test(String(this.state.productName))
    }

    validateSize() {
        const pattern = /^[a-zA-Z- 0-9]+$/
        return pattern.test(String(this.state.size))
    }

    validateColor() {
        const pattern = /^[a-zA-Z- ]+$/
        return pattern.test(String(this.state.color))
    }

    validateStockLevel() {
        const stockLevel = parseInt(this.state.stockLevel)
        return (stockLevel >= 0 && stockLevel <= 100)
    }

    validatePrice() {
        const price = parseInt(this.state.price)
        return (price >= 0 && price <= 1000)
    }

    validate() {
        return {
            productName: this.validateName(),
            size: this.validateSize(),
            color: this.validateColor(),
            stockLevel: this.validateStockLevel(),
            price: this.validatePrice()
        };

    }

    render() {
        let errorMessage = "";
        if (this.state.wasSubmittedAtLeastOnce) {
            errorMessage = <div className="error">Product Details are incorrect<br/></div>;
        }
        return (
            <div className="form-container">

                {this.state.redirectToDisplayAllProducts ? <Redirect to="/DisplayAllProducts"/> : null}

                <Form>
                    {errorMessage}
                    <Form.Group controlId="name">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control ref={(input) => {
                            this.inputToFocus = input
                        }} type="text" name="productName" value={this.state.productName} onChange={this.handleChange}/>
                    </Form.Group>

                    <Form.Group controlId="size">
                        <Form.Label>Size</Form.Label>
                        <Form.Control type="text" name="size" value={this.state.size} onChange={this.handleChange}/>
                    </Form.Group>

                    <Form.Group controlId="color">
                        <Form.Label>Color</Form.Label>
                        <Form.Control type="text" name="color" value={this.state.color} onChange={this.handleChange}/>
                    </Form.Group>

                    <Form.Group controlId="stock">
                        <Form.Label>Stock Level</Form.Label>
                        <Form.Control type="text" name="stockLevel" value={this.state.stockLevel}
                                      onChange={this.handleChange}/>
                    </Form.Group>

                    <Form.Group controlId="price">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="text" name="price" value={this.state.price} onChange={this.handleChange}/>
                    </Form.Group>
                    {this.state.productImages.map(photo => <img key={photo._id} className="modalImage" id={photo._id}
                                                                alt=""/>)}
                    <Form.Group controlId="productImages">
                        <Form.Label>Photos</Form.Label>
                        <Form.Control
                            type="file" multiple onChange={this.handleFileChange}
                        /></Form.Group> <br/><br/>

                    <LinkInClass value="Update" className="green-button" onClick={this.handleSubmit}/>

                    <Link className="red-button" to={"/DisplayAllProducts"}>Cancel</Link>
                </Form>
            </div>
        )
    }
}