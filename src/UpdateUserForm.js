import React from 'react';

class UpdateUserForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {userName: props.inUser.userName,email: props.inUser.email,userId: props.inUser.userId,description: '',isRoot: 0}
        this.user = props.inUser
    }

    componentDidUpdate() {
        var inUser = this.user
        console.log(inUser.email)
        console.log(this.props.inUser.email)
        console.log(this.state.email)
        if (inUser.email === '' && this.props.inUser.email !== '') {
            inUser = this.props.inUser
            this.user = inUser
            this.setState(state => ({
                description: inUser.description,
                email: inUser.email,
                userName: inUser.userName,
                isRoot: inUser.isRoot,
                userId: inUser.userId
            })) 
        } else
        if (inUser.email !== this.state.email) {
            //separate case between props an state, check inUser.email first, and set as needed
            this.setState(state => ({
                description: inUser.description,
                email: inUser.email,
                userName: inUser.userName,
                isRoot: inUser.isRoot,
                userId: inUser.userId
            }))
        }
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
                description: newValue
            }))
        }

    }

    handleSubmit = (e) => {
        e.preventDefault();
        console.log('handleSubmit')
        this.user.userName = this.state.userName
        this.user.email = this.state.email
        this.user.description = this.state.description
        this.user.isRoot = this.state.isRoot
        this.props.nameHandler(this.user)
        e.preventDefault();
    }

    render() {
        let form;
        if (this.user.userId > 0) {
            form = (
<form onSubmit={this.handleSubmit}>
            <label>User Name:
                <input type="text" value={this.state.userName} onChange={this.handleChange} />
            </label>
            <label>email
                <input type="email" value={this.state.email} onChange={this.handleChange} />
            </label>
            <label>descriptionription
                <textarea value={this.state.description} onChange={this.handleChange} />
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
            </form>
            )
        } else {
            form = <p>Waiting for user.</p>
        }
        return (
            <div>
                {form}
            </div>
        )
    }
}
export default UpdateUserForm