import React, {Component} from "react"
import {Link} from "react-router-dom"

import DeleteIcon from '@mui/icons-material/Delete';
//import EditIcon from '@mui/icons-material/Edit';
import {ACCESS_LEVEL_ADMIN, ACCESS_LEVEL_GUEST} from "../../config/global_constants";

export default class SaleTableRow extends Component
{    
    render() 
    {
        return (
            <tr>
                <td>{this.props.sale.paypalPaymentID}</td>
                <td>{this.props.sale.productID}</td>
                <td>{this.props.sale.price}</td>

                <td>
                    {/*{localStorage.accessLevel > ACCESS_LEVEL_GUEST ?*/}
                    {/*<Link className="edit-button"*/}
                    {/*      to={"/EditProduct/" + this.props.product._id}><EditIcon></EditIcon></Link>*/}

                    {/*    : null}*/}

                </td>
            </tr>
        )
    }
}