import React from 'react';
import {setFormHeader} from '../utils/formUtils'
import {handleInputChange} from '../utils/formUtils'

class UpdateUserForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {user: props.inUser,userName: props.inUser.userName,email: props.inUser.email,userId: props.inUser.userId,description: props.inUser.description,isRoot: props.inUser.isRoot}
    }

    componentDidUpdate() {
        console.log(this.props.inUser)
        console.log(this.state.user)
        if (this.props.inUser.userId !== this.state.user.userId || this.state.userName !== this.state.user.userName)
            this.setState({
                user: this.props.inUser,
                userName: this.props.inUser.userName,
                email: this.props.inUser.email,
                description: this.props.inUser.description,
                isRoot: this.props.inUser.isRoot,
                userId: this.props.inUser.userId
            })
    }

    handleChange = (e) => {
        this.setState(handleInputChange(e))
    }

    handleSubmit = (e) => {
        var subUser = this.state.user
        subUser.userName = this.state.userName
        subUser.email = this.state.email
        subUser.description = this.state.description
        subUser.isRoot = this.state.isRoot

        this.props.nameHandler(subUser)
        e.preventDefault();
    }

    render() {
        let form;
        if (this.state.user.userId > 0) {
            form = (<div>
            <div>{setFormHeader("Edit User")}</div>
            <form onSubmit={this.handleSubmit}>
            <label>User Name:
                <input name="userName" type="text" value={this.state.userName} onChange={this.handleChange} />
            </label>
            <label>email
                <input name="email" type="email" value={this.state.email} onChange={this.handleChange} />
            </label>
            <label>Description:
                <textarea name="description" value={this.state.description} onChange={this.handleChange} />
            </label>              
            <label>
            Is Root?:
            <input
                name="isRoot"
                type="checkbox"
                checked={this.state.isRoot}
                onChange={this.handleChange} />
            </label>      
            <input type="submit" value="Submit" />
            </form></div>
            )
        } else {
            form = <p></p>
        }
        return (
            <div>
                {form}
            </div>
        )
    }
}
export default UpdateUserForm