import React from 'react';
import {setFormHeader, handleInputChange, updateHandler, toggleIsVis} from '../utils/formUtils'

class UpdateUserForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            vis: false,
            user: props.inUser,
            userName: props.inUser.userName,
            email: props.inUser.email,
            userId: props.inUser.userId,
            description: props.inUser.description,
            isRoot: props.inUser.isRoot,
            modalReturn: props.modalReturn
        }
    }

    componentDidUpdate() {
        if (this.props.modalReturn !== this.state.modalReturn) {
            this.setState({
                modalReturn: this.props.modalReturn
            },this.handleModalData())
        }
        if (this.props.inUser.userId !== this.state.user.userId || this.state.userName !== this.state.user.userName)
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
        this.setState(handleInputChange(e))
    }

    handleModalData = () => {
        console.log(this.state.modalReturn)
    }

    handleHeaderClick = (e) => {
        this.setState(toggleIsVis(this.state))
    }

    handleSubmit = (e) => {
        var subUser = this.state.user
        subUser.userName = this.state.userName
        subUser.email = this.state.email
        subUser.description = this.state.description
        subUser.isRoot = this.state.isRoot

        updateHandler("user", subUser, this.props.updateUserHandler)
        e.preventDefault();

    }

    render() {
        let form;
        if (this.state.user.userId > 0 && this.state.vis) {
            form = (<div>
            <div>{setFormHeader("Edit User", this.handleHeaderClick)}</div>
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
        } else if (this.state.user.userId > 0 && !this.state.vis) {
            form = (<div>   
            <div>{setFormHeader("Edit User", this.handleHeaderClick)}</div>
            </div>)
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