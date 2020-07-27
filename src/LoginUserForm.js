import React from 'react';

class LoginUserForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {user: this.props.inUser, userName: props.inUser.userName,email: props.inUser.email,password: ''}
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
        else if (typeof(inUser.password) !== 'undefined' && inUser.password.length > 0) {
            delete inUser.password
            this.setState({
                password: ''
            }) 
        }
    }

    handleChange = (e) => {
        const {checked, name, value, type} = e.target
        const valueToUpdate = type === 'checkbox' ? checked : value
        this.setState({
            [name]: valueToUpdate
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.user.userName = this.state.userName
        this.user.email = this.state.email
        this.user.userId = -1
        this.user.password = this.state.password
        this.props.nameHandler(this.user)
        e.preventDefault();
    }

    userLogout = (e) => {
        e.preventDefault();
        this.user.userName = ''
        this.user.userId = 0
        this.user.email = ''
        this.user.description = ''
        this.user.isRoot = 0
        this.props.nameHandler(this.user)
    }
    render() {
        const title = <div><h3>Login</h3></div>
        let form;
        if (this.state.user.userId < 1) {
            form = (<div>
            <div>{title}</div>
            <form onSubmit={this.handleSubmit}>
            <label>User Name to load:
                <input name="userName" type="text" value={this.state.userName} onChange={this.handleChange} />
            </label>
            <label>email to load:
                <input name="email" type="email" value={this.state.email} onChange={this.handleChange} />
            </label>
            <label>password:
                <input name="password" type="password" value={this.state.password} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
            </form>
            </div>
            )
        } else {
            form = <button onClick={this.userLogout}>Logout</button>
        }
        return (
            <div>
                {form}
            </div>
        )
    }
}
export default LoginUserForm