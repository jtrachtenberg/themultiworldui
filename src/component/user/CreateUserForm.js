import React from 'react';
import {setFormHeader, handleInputChange, createHandler} from '../utils/formUtils'
import {userStateData} from '../utils/defaultObjects'
class CreateUserForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {user: props.inUser,userName: '',email: '',password: ''}
        this.user = props.inUser
    }

    componentDidUpdate() {
        var inUser = this.state.user
        if ((inUser.userId < 1 && this.props.inUser.userId > 0) || (this.props.inUser.userId < 1 && inUser.userId > 0))
            this.setState({
                user: this.props.inUser,
                userName: this.props.inUser.userName,
                email: this.props.inUser.email,
                password: ''
            })
    }

    handleChange = (e) => {
        this.setState(handleInputChange(e))
    }

    handleSubmit = (e) => {
        this.user.userName = this.state.userName
        this.user.email = this.state.email
        this.user.password = this.state.password
        const stateData = userStateData
        this.user.stateData = stateData
        createHandler("user", this.user, this.props.updateUserHandler)
        e.preventDefault();
    }

    render() {
        if (this.state.user.userId < 1 || this.state.user.isRoot)
        return (<div>
            <div>{setFormHeader("Create User")}</div>
            <form onSubmit={this.handleSubmit}>
                <label>User Name:
                    <input name="userName" type="text" value={this.state.userName} onChange={this.handleChange} />
                </label>
                <label>email
                    <input name="email" type="email" value={this.state.email} onChange={this.handleChange} />
                </label>
                <label>Password
                    <input name="password" type="password" value={this.state.password} onChange={this.handleChange} />
                </label>                  
                <input type="submit" value="Submit" />
            </form>
            </div>
        )
        else
        return (
            <div></div>
        )
    }
}
export default CreateUserForm