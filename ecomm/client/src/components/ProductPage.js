import React, {Component} from "react"
import ProductEntity from "./ProductEntity";

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
            <div className="products">
                    {this.props.products.map((product) => <ProductEntity key={product._id} product={product}/>)}
            </div>
        )
    }
}