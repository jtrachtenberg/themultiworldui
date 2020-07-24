import React from 'react';

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
        if (inSpace.spaceId !== this.props.inSpace.spaceId)
            this.setState({
                space: this.props.inSpace,
            })
    }

    handleChange = (e) => {
        var newValue = e.target.name === 'isRoot' ? e.target.checked : e.target.value
        if (e.target.name === 'title') {
            this.setState(state => ({
                title: newValue
            }))  
        } else if (e.target.name === 'description') {
            this.setState(state => ({
                description: newValue
            }))
        } else {
            this.setState(state => ({
                isRoot: newValue
            }))
        }

    }

    handleSubmit = (e) => {
        this.space.title = this.state.title
        this.space.description = this.state.description
        this.space.isRoot = this.state.isRoot
        this.props.spaceHandler(this.space)
        e.preventDefault();
    }

    render() {
        if (this.state.space.spaceId < 1)
        return (
            <form onSubmit={this.handleSubmit}>
            <label>Title
                <input name="title" type="text" value={this.state.title} onChange={this.handleChange} />
            </label>
            <label>Description:
                <textarea name="desc" value={this.state.description} onChange={this.handleChange} />
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
        else
        return (
            <div>Load new Space</div>
        )
    }
}
export default CreateSpaceForm