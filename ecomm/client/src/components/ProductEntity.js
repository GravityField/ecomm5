import React, {Component} from "react"
import {Link} from "react-router-dom"

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {ACCESS_LEVEL_ADMIN, ACCESS_LEVEL_GUEST, SERVER_HOST} from "../config/global_constants";
import axios from "axios";

export default class ProductEntity extends Component
{
    componentDidMount()
    {
        this.props.product.productImages.map(photo =>
        {
            return axios.get(`${SERVER_HOST}/product/photo/${photo.filename}`)
                .then(res =>
                {
                    if(res.data)
                    {
                        if (res.data.errorMessage)
                        {
                            console.log(res.data.errorMessage)
                        }
                        else
                        {
                            document.getElementById(photo._id).src = `data:;base64,${res.data.image}`
                        }
                    }
                    else
                    {
                        console.log("Record not found")
                    }
                })
                .catch(error => {

                        console.log(error)
                    }
                )
        })
    }
    render()
    {
        return (
            <div className="product">
            <Link to={"/DisplayProductDetails/" + this.props.product._id}>{this.props.product.productName}</Link>
                <div className="productPhotos">
                    {this.props.product.productImages.map(photo => <img key={photo._id} id={photo._id} alt=""/>)}
                    {/*{<img key={this.props.product.productImages._id} id={this.props.product.productImages[0]._id} alt=""  />}*/}

                </div>
                <p>{this.props.product.size}</p>
                {/*<p>{this.props.product.color}</p>*/}
                    <p>{this.props.product.stockLevel}</p>
                        <p>€{this.props.product.price}</p>

                    {localStorage.accessLevel > ACCESS_LEVEL_GUEST ?
                    <Link className="edit-button"
                          to={"/EditProduct/" + this.props.product._id}><EditIcon/></Link>

                        : null}
                    {localStorage.accessLevel >= ACCESS_LEVEL_ADMIN ?
                        <Link className="delete-button"
                          to={"/DeleteProduct/" + this.props.product._id}><DeleteIcon/></Link>
                        : null}

    </div>
        )
    }
}