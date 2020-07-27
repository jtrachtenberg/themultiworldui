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
        /*else if (this.state.userName !== this.props.inUser.userName)
            this.setState({
                user: this.props.inUser,
                userName: this.props.inUser.userName,
                email: this.props.inUser.email,
                description: this.props.inUser.description,
                isRoot: this.props.inUser.isRoot,
                userId: this.props.inUser.userId
            })*/
    }

    handleChange = (e) => {
        const {checked, name, value, type} = e.target
        const valueToUpdate = type === 'checkbox' ? checked : value
        this.setState({
            [name]: valueToUpdate
        })
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
        const title = <div><h3>Edit User</h3></div>
        let form;
        if (this.state.user.userId > 0) {
            form = (<div>
                <div>{title}</div>
<form onSubmit={this.handleSubmit}>
            <label>User Name:
                <input name="userName" type="text" value={this.state.userName} onChange={this.handleChange} />
            </label>
            <label>email
                <input name="email" type="email" value={this.state.email} onChange={this.handleChange} />
            </label>
            <label>Description:
                <textarea name="description" value={this.state.description} onChange={this.handleChange} />
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
            </form></div>
            )
        } else {
            form = <p></p>
        }
        return (
            <div>
                {form}
            </div>
        )
    }
}
export default UpdateUserForm