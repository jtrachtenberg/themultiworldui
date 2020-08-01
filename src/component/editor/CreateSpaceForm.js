import React from 'react';
import {setFormHeader} from '../utils/formUtils'

class CreateSpaceForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {user: props.inUser,space: props.inSpace,title: props.inSpace.title,description: props.inSpace.description,isRoot: props.inSpace.isRoot}
        this.user = props.inUser
    }

    componentDidUpdate() {
        var inUser = this.state.user
        if (inUser.userId !== this.props.inUser.userId)
            this.setState({
                user: this.props.inUser,
            })
        var inSpace = this.state.space
        console.log(inSpace)
        console.log(this.props.inSpace)
        if (inSpace.spaceId !== this.props.inSpace.spaceId)
            this.setState({
                space: this.props.inSpace,
            })
    }

    handleChange = (e) => {
        const {checked, name, value, type} = e.target
        const valueToUpdate = type === 'checkbox' ? checked : value
        this.setState({
            [name]: valueToUpdate
        })
    }

    handleSubmit = (e) => {
        console.log('handleSubmit')
        const space = this.state.space
        space.title = this.state.title
        space.description = this.state.description
        space.isRoot = this.state.isRoot
        space.userId = this.user.userId
        this.props.spaceHandler(space)
        e.preventDefault();
    }

    render() {
        if (this.state.space.spaceId < 1 && this.state.user.userId > 0)
        return (
            <div>
            <div>{setFormHeader("Create Space")}</div>
            <form onSubmit={this.handleSubmit}>
            <label>Title
                <input name="title" type="text" value={this.state.title} onChange={this.handleChange} />
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
            </form>
            </div>
        )
        else if (this.state.user.userId < 1)
        return (
            <div></div>
        )
        else return (
        <div>
        <div>{setFormHeader(this.state.space.title+" Loaded Successfully")}</div>
        </div>
        )
    }
}

export default CreateSpaceForm