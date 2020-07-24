import React from 'react';

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
        var newValue = e.target.value
        if (e.target.type === 'text') {
            this.setState(state => ({
                userName: newValue
            }))  
        } else if (e.target.type === 'password') {
            this.setState(state => ({
                password: newValue
            }))
        } else {
            this.setState(state => ({
                email: newValue
            }))
        }

    }

    handleSubmit = (e) => {
        this.user.userName = this.state.userName
        this.user.email = this.state.email
        this.user.password = this.state.password
        this.props.nameHandler(this.user)
        e.preventDefault();
    }

    render() {
        if (this.state.user.userId < 1)
        return (
            <form onSubmit={this.handleSubmit}>
                <label>User Name:
                    <input type="text" value={this.state.userName} onChange={this.handleChange} />
                </label>
                <label>email
                    <input type="email" value={this.state.email} onChange={this.handleChange} />
                </label>
                <label>Password
                    <input type="password" value={this.state.password} onChange={this.handleChange} />
                </label>                  
                <input type="submit" value="Submit" />
            </form>
        )
        else
        return (
            <div></div>
        )
    }
}
export default CreateUserForm