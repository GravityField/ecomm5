import React, {Component} from "react"
import ProductTableRow from "./ProductTableRow"


let order = false;
let products;
export default class ProductTable extends Component
{
    handleSort(sortType) {
           order ?  products = this.props.products.sort((a, b) => a[sortType] < b[sortType] ? -1 : 1) : products = this.props.products.sort((a, b) => a[sortType] < b[sortType] ? 1 : -1)
        order = !order;
        this.setState({products})

    }
    render() 
    {
        return (
            <table>
                <thead>
                    <tr>
                        <th onClick={() => this.handleSort("productName")}>Name</th>
                        <th onClick={() => this.handleSort("size")}>Size</th>
                        <th onClick={() => this.handleSort("color")}>Color</th>
                        <th onClick={() => this.handleSort("stockLevel")}>Stock</th>
                        <th onClick={() => this.handleSort("price")}>Price</th>
                        <th/>
                        <th/>
                    </tr>
                </thead>
                  
                <tbody >
                    {this.props.products.map((product) => <ProductTableRow key={product._id} product={product}/>)}
                </tbody>
            </table>      
        )
    }
}