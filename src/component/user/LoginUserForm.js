import React from 'react';
import {setFormHeader} from '../utils/formUtils'
import {userLogin} from './UserLogin'
import {User} from '../utils/defaultObjects'
import {handleInputChange} from '../utils/formUtils'

class LoginUserForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {disabled: false, hidden: true, user: this.props.inUser, userName: props.inUser.userName,email: props.inUser.email,password: ''}
    }

    componentDidUpdate() {
        
        var inUser = this.state.user
        if ((inUser.userId < 1 && this.props.inUser.userId > 0) || (this.props.inUser.userId < 1 && inUser.userId > 0))
            this.setState({
                user: this.props.inUser,
                userName: this.props.inUser.userName,
                email: this.props.inUser.email,
                password: '',
                disabled: false
            })
        else if (typeof(inUser.password) !== 'undefined' && inUser.password.length > 0) {
            delete inUser.password
            this.setState({
                password: ''
            }) 
        }
    }

    handleChange = (e) => {
        this.setState(handleInputChange(e))
    }

    handleSubmit = (e) => {
        if (this.state.disabled) {
            return
        }
        this.setState({
            disabled: true
        })
        const loginUser = this.state.user
        loginUser.userName = this.state.userName
        loginUser.email = this.state.email
        loginUser.password = this.state.password
        userLogin(loginUser, this.props.loginHandler)
        this.setState({
            disabled: false
        })
        e.preventDefault();
    }

    userLogout = (e) => {
        e.preventDefault();
        console.log('logout')
        const blankUser = User
        this.props.nameHandler(blankUser)
    }
    render() {
        let form;
        if (this.state.user.userId < 1) {
            form = (
            <div className="fillSpace">
            <div>{setFormHeader("Login")}</div>
            <form id="login_form">
            <section>
                <label htmlFor="email">email:</label>
                <input id="email" name="email" type="email" autoComplete="email" required value={this.state.email === null ? '' : this.state.email} onChange={this.handleChange} />
            </section>
            <section>
                <label htmlFor="password">password:</label>
                <input id="password" name="password" type={this.state.hidden ? "password" : "text"} required value={this.state.password} onChange={this.handleChange} />
            </section>
            <button onClick={this.handleSubmit} disabled={this.state.disabled}>{this.state.disabled ? 'Authorizing' : 'Login'}</button>
            </form>
            </div>
            )
        } else {
        form = <button onClick={this.userLogout} disabled={this.state.disabled}>{this.state.disabled ? 'Logging out' : 'Logout'}</button>
        }
        return (
            <div>
                {form}
            </div>
        )
    }
}
export default LoginUserForm