import React from 'react';

class LoginUserForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {userName: props.inUser.userName,email: props.inUser.email,userId: props.inUser.userId,desc: '',isRoot: 0}
        this.user = props.inUser
    }

    componentDidUpdate() {
        var inUser = this.user
        console.log(inUser.email)
        console.log(this.props.inUser.email)
        console.log(this.state.email)
        if (inUser.email !== this.state.email) {
            this.setState(state => ({
                desc: inUser.desc,
                email: inUser.email,
                userName: inUser.userName,
                isRoot: inUser.isRoot,
                userId: inUser.userId
            }))
        }
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
        }

    }

    handleSubmit = (e) => {
        e.preventDefault();
        console.log('handleSubmit')
        this.user.userName = this.state.userName
        this.user.email = this.state.email
        this.user.userId = -1
        this.props.nameHandler(this.user)
        e.preventDefault();
    }

    render() {
        let form;
        if (this.user.userId === 0) {
            form = (
            <form onSubmit={this.handleSubmit}>
            <label>User Name to load:
                <input type="text" value={this.state.userName} onChange={this.handleChange} />
            </label>
            <label>email to load:
                <input type="email" value={this.state.email} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
            </form>
            )
        } else {
            form = <p>User Loaded.</p>
        }
        return (
            <div>
                {form}
            </div>
        )
    }
}
export default LoginUserForm