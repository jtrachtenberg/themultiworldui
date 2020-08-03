import React from 'react';
import {setFormHeader} from '../utils/formUtils'

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
        const {checked, name, value, type} = e.target
        const valueToUpdate = type === 'checkbox' ? checked : value
        this.setState({
            [name]: valueToUpdate
        })
    }

    handleSubmit = (e) => {
        this.user.userName = this.state.userName
        this.user.email = this.state.email
        this.user.password = this.state.password
        const stateData = {
            currentRoom: 0,
            currentSpace: 0
          }
        this.user.stateData = stateData
        this.props.nameHandler(this.user)
        e.preventDefault();
    }

    render() {
        if (this.state.user.userId < 1)
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