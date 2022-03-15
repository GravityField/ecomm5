import React, {Component} from "react"
import UserTableRow from "./UserTableRow";

export default class UserTable extends Component
{

    render() 
    {
        return (
            <table>
                <thead>
                    <tr>
                        <th>Access Level</th>
                        <th>Name</th>
                        <th>Email</th>

                        <th> </th>
                    </tr>
                </thead>
                  
                <tbody >
                    {this.props.users.map((user) => <UserTableRow key={user._id} user={user}/>)}
                </tbody>
            </table>      
        )
    }
}