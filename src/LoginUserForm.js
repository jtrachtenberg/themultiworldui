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
    }

    handleChange = (e) => {
        var newValue = e.target.value

        if (e.target.type === 'text') {
            this.setState(state => ({
                userName: newValue
            }))  
        } else if (e.target.type === 'email') {
            this.setState(state => ({
                email: newValue
            }))
        } else if (e.target.type === 'password') {
            this.setState(state => ({
                password: newValue
            }))
        }

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
        let form;
        if (this.state.user.userId < 1) {
            form = (
            <form onSubmit={this.handleSubmit}>
            <label>User Name to load:
                <input type="text" value={this.state.userName} onChange={this.handleChange} />
            </label>
            <label>email to load:
                <input type="email" value={this.state.email} onChange={this.handleChange} />
            </label>
            <label>password:
                <input type="password" value={this.state.password} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
            </form>
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