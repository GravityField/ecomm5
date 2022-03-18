import React, {Component} from "react"
import {Link} from "react-router-dom"

import axios from "axios"

import ProductTable from "./ProductTable"

import {ACCESS_LEVEL_ADMIN, ACCESS_LEVEL_NORMAL_USER, SERVER_HOST} from "../../config/global_constants"




export default class DisplayAllProducts extends Component
{
    constructor(props)
    {
        super(props)

        this.state = {
            products:[],
            selectedProducts:[],
            size:"",
            sizes:[],
            colours:[],
            selectedSize: "All Sizes",
            selectedColour: "All Colours"
        }
    }


    componentDidMount()
    {
        axios.get(`${SERVER_HOST}/products`)
            .then(res =>
            {


                if(res.data)
                {
                    let sizes = res.data.map(product => product.size)
                    let uniqueSizes = [...new Set(sizes)].sort()
                    uniqueSizes.unshift("All Sizes")

                    let colours = res.data.map(product => product.color)
                    let uniqueColours = [...new Set(colours)].sort()
                    uniqueColours.unshift("All Colours")
                    if (res.data.errorMessage)
                    {
                        console.log(res.data.errorMessage)
                    }
                    else
                    {
                        console.log("Records read")
                        this.setState({products: res.data,
                        selectedProducts: res.data,
                        sizes: uniqueSizes,
                        colours: uniqueColours})
                    }
                }
                else
                {
                    console.log("Record not found")
                }
            })
    }

    filterSize = e => {
        this.setState({selectedSize: e.target.value})

        if (e.target.value === "All Sizes") {
            this.setState({selectedProducts: this.state.products})
        } else {
            this.setState({selectedProducts: this.state.products.filter(product => product.size.toString() === e.target.value)})
        }
    }


    filterColour = e => {
        this.setState({selectedColour: e.target.value})

        if (e.target.value === "All Colours") {
            this.setState({selectedProducts: this.state.products})
        } else {
            this.setState({selectedProducts: this.state.products.filter(product => product.color.toString() === e.target.value)})
        }
    }

    handleSearch = (searchTag) => {

        this.setState({
                selectedProducts: this.state.products.filter(product => product.productName.toLowerCase().includes(searchTag.toLowerCase())
            || (product.size.toLowerCase().includes(searchTag.toLowerCase()) )
                        || (product.color.toLowerCase().includes(searchTag.toLowerCase()) )
                        || (product.stockLevel.toString().includes(searchTag.toString()))
                        || (product.price.toString().includes(searchTag.toString() ))
                )

            }
        )
    }

    filter = e =>{

        let fil1 = document.getElementById("filterList1").value;
        let fil2 = document.getElementById("filterList2").value;
        if (fil1 === "All Sizes" && fil2 === "All Colours") {
            this.setState({selectedProducts: this.state.products})
        }
        else if (fil1 !== "All Sizes" && fil2 === "All Colours")
        {
            this.setState({selectedProducts: this.state.products.filter(product => product.size.toString() === fil1)})
        }
        else if (fil1 === "All Sizes" && fil2 !== "All Colours")
        {
            this.setState({selectedProducts: this.state.products.filter(product => product.color.toString() === fil2)})
        }
        else {
            this.setState({selectedProducts: this.state.products.filter(product => product.size.toString() === fil1).filter(product => product.color.toString() === fil2)}
            )

        }
    }

    render()
    {
        return (
            <div className="form-container">
                <div>{localStorage.accessLevel >= ACCESS_LEVEL_NORMAL_USER ?
                    <h1>Hello {localStorage.name}
                    </h1> : null}
                    {
                        localStorage.profilePhoto !== "undefined"
                            ? <img id="profilePhoto" src={`data:;base64,${localStorage.profilePhoto}`} alt=""/>
                            : null
                    }
                    <br/><br/><br/>
                    <select
                        name="filters"
                        id="filterList1"
                        onChange={this.filter}
                    >
                        {this.state.sizes.map(size => <option key={size}
                                                              value={size}>{size}</option>)}
                    </select>
                    <select
                        name="filters"
                        id="filterList2"
                        onChange={this.filter}
                    >
                        {this.state.colours.map(color => <option key={color}
                                                              value={color}>{color}</option>)}
                    </select>
                    <div className="search-container">
                        <input type="text" placeholder="Search..." id="search" onChange={() => this.handleSearch(document.getElementById('search').value)}/>

                    </div>

                </div>

                <div className="table-container">

                    <ProductTable products={this.state.selectedProducts} />

                    <div className="add-new-product">
                        {localStorage.accessLevel >= ACCESS_LEVEL_ADMIN ?
                        <Link className="add-button" to={"/AddProduct"}>Add New Product</Link>
                            : null}
                    </div>
                </div>
            </div>

        )
    }
}