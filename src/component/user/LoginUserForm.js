import React, {createRef} from 'react';
import {setFormHeader} from '../utils/formUtils'
import {userLogin} from './UserLogin'
import {User} from '../utils/defaultObjects'
import {handleInputChange} from '../utils/formUtils'
import {ReactComponent as MenuIcon} from '../menu.svg';

class LoginUserForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {passwordValid: false, emailValid: false, buttonText: 'Login', disabled: this.props.inUser.userId < 1 ? true : false, hidden: true, user: this.props.inUser, userName: props.inUser.userName,email: props.inUser.email,password: ''}
        this.buttonRef = createRef()
    }

    componentDidUpdate() {
        
        var inUser = this.state.user
        if ((inUser.userId < 1 && this.props.inUser.userId > 0) || (this.props.inUser.userId < 1 && inUser.userId > 0))
            this.setState({
                user: this.props.inUser,
                userName: this.props.inUser.userName,
                email: this.props.inUser.email,
                password: '',
                disabled: true,
                buttonText: 'Login'

            })
        else if (typeof(inUser.password) !== 'undefined' && inUser.password.length > 0) {
            delete inUser.password
            this.setState({
                password: ''
            }) 
        }
    }

    handleChange = (e) => {
        const rulesets = []

        if (e.target.name === 'email') {
            const pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
            rulesets.push({
                'type':'validate',
                'regexp': pattern,
                'state': 'emailValid',
                'invert': false
            })
        }
        if (e.target.name === 'password') {
            const pattern = new RegExp(/^.{3,}$/)//minimum 3 characters for now
            rulesets.push({
                'type':'validate',
                'regexp': pattern,
                'state': 'passwordValid',
                'invert': false
            })
        }
        this.setState(handleInputChange(e,rulesets),() => {
            this.setState({
                'disabled': !(this.state.passwordValid&&this.state.emailValid)
            })
        })
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
        if (typeof(this.props.close) === 'function') {
            this.props.close(loginUser)
        }
        e.preventDefault();
    }

    userLogout = (e) => {
        e.preventDefault();
        const update = {}
        update.stateData=this.props.inUser.stateData
        update.stateData.logout=true
        update.userId=this.props.inUser.userId
        this.props.socket.emit('incoming data', update)
        this.props.socket.off(`auth:${this.props.inUser.userId}`)
        const blankUser = Object.assign(User)
        blankUser.userId=0
        blankUser.description=""
        blankUser.email=""
        blankUser.stateData={}
        blankUser.userName=""
        this.props.loginHandler(blankUser)
    }
    render() {
        let form;
        if ( this.props.inUser.userId < 1) {
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
            <button ref={this.buttonRef} onClick={this.handleSubmit} disabled={this.state.disabled}>{this.state.buttonText}</button>
            </form>
            </div>
            )
        } else {
        form = <span><button className="logout" onClick={this.userLogout} disabled={this.state.disabled}>{this.state.disabled ? 'Logging out' : 'Logout'}</button><MenuIcon className="menuIcon" onClick={() => {
            this.props.menuToggle()
        }} /></span>
        }
        return (
            <div>
                {form}
            </div>
        )
    }
}
export default LoginUserForm