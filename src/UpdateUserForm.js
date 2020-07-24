import React from 'react';

class UpdateUserForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {user: props.inUser,userName: props.inUser.userName,email: props.inUser.email,userId: props.inUser.userId,description: props.inUser.description,isRoot: props.inUser.isRoot}
    }

    componentDidUpdate() {
        if (this.props.inUser.userId !== this.state.user.userId)
            this.setState({
                user: this.props.inUser,
                userName: this.props.inUser.userName,
                email: this.props.inUser.email,
                description: this.props.inUser.description,
                isRoot: this.props.inUser.isRoot,
                userId: this.props.inUser.userId
            })
        else if (this.state.userName !== this.props.inUser.userName)
            this.setState({
                user: this.props.inUser,
                userName: this.props.inUser.userName,
                email: this.props.inUser.email,
                description: this.props.inUser.description,
                isRoot: this.props.inUser.isRoot,
                userId: this.props.inUser.userId
            })
    }

    handleChange = (e) => {
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
        var subUser = {
            userName: this.state.userName,
            email: this.state.email,
            description: this.state.description,
            isRoot: this.state.isRoot,
            userId: this.state.userId
        }

        this.props.nameHandler(subUser)
        e.preventDefault();
    }

    render() {
        let form;
        if (this.state.user.userId > 0) {
            form = (
<form onSubmit={this.handleSubmit}>
            <label>User Name:
                <input type="text" value={this.state.userName} onChange={this.handleChange} />
            </label>
            <label>email
                <input type="email" value={this.state.email} onChange={this.handleChange} />
            </label>
            <label>Description:
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