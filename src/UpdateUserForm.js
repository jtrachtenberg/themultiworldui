import React from 'react';

class UpdateUserForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {userName: props.inUser.userName,email: props.inUser.email,userId: props.inUser.userId,desc: '',isRoot: 0}
        this.user = props.inUser
    }

    handleChange = (e) => {
        console.log(e.target)
        var newValue = e.target.name === 'isRoot' ? e.target.checked : e.target.value
        if (e.target.type === 'text') {
            this.setState(state => ({
                userName: newValue
            }))  
        } else if (e.target.type === 'email') {
            this.setState(state => ({
                email: newValue
            }))
        } else if (e.target.name === 'isRoot') {
            this.setState(state=> ({
                isRoot: newValue
            }))
        } else {
            this.setState(state => ({
                desc: newValue
            }))
        }

    }

    handleSubmit = (e) => {
        e.preventDefault();
        console.log('handleSubmit')
        this.user.userName = this.state.userName
        this.user.email = this.state.email
        this.props.nameHandler(this.user)
        e.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>User Name:
                    <input type="text" value={this.state.userName} onChange={this.handleChange} />
                </label>
                <label>email
                    <input type="email" value={this.state.email} onChange={this.handleChange} />
                </label>
                <label>Description
                    <textarea value={this.state.desc} onChange={this.handleChange} />
                </label>              
                <label>
                Is going:
                <input
                    name="isRoot"
                    type="checkbox"
                    checked={this.state.isRoot}
                    onChange={this.handleChange} />
                </label>      
                <input type="submit" value="Submit" />
            </form>
        )
    }
}
export default UpdateUserForm