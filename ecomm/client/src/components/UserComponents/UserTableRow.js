import React, {Component} from "react"
import {Link} from "react-router-dom"

import DeleteIcon from '@mui/icons-material/Delete';
//import EditIcon from '@mui/icons-material/Edit';
import {ACCESS_LEVEL_ADMIN, ACCESS_LEVEL_GUEST} from "../../config/global_constants";

export default class UserTableRow extends Component
{    
    render() 
    {
        return (
            <tr>
                <td>{this.props.user.accessLevel}</td>
                <td>{this.props.user.name}</td>
                <td>{this.props.user.email}</td>

                <td>
                    {/*{localStorage.accessLevel > ACCESS_LEVEL_GUEST ?*/}
                    {/*<Link className="edit-button"*/}
                    {/*      to={"/EditProduct/" + this.props.product._id}><EditIcon></EditIcon></Link>*/}

                    {/*    : null}*/}
                    {localStorage.accessLevel >= ACCESS_LEVEL_ADMIN ?
                        <Link className="delete-button"
                          to={"/DeleteUser/" + this.props.user._id}><DeleteIcon></DeleteIcon></Link>
                        : null}
                </td>
            </tr>
        )
    }
}