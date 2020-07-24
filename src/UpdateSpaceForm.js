import React from 'react';

class UpdateSpaceForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {user: props.inUser,space: props.inSpace, title: props.inSpace.title,spaceId: props.inSpace.spaceId,description: props.inSpace.description,isRoot: props.inSpace.isRoot}
    }

    componentDidUpdate() {
        if (this.props.inUser.userId !== this.state.user.userId)
            this.setState({
                user: this.props.inUser,
                space: this.props.inSpace,
                title: this.props.inSpace.title,
                description: this.props.inSpace.description,
                isRoot: this.props.inSpace.isRoot,
                spaceId: this.props.inSpace.spaceId
            })
    }

    handleChange = (e) => {
        var newValue = e.target.name === 'isRoot' ? e.target.checked : e.target.value
        if (e.target.name === 'title') {
            this.setState(state => ({
                title: newValue
            }))  
        } else if (e.target.name === 'desc') {
            this.setState(state => ({
                description: newValue
            }))
        } else if (e.target.name === 'isRoot') {
            this.setState(state=> ({
                isRoot: newValue
            }))
        }
    }

    handleSubmit = (e) => {
        var subSpace = {
            title: this.state.title,
            description: this.state.description,
            isRoot: this.state.isRoot,
            spaceId: this.state.spaceId,
            userId: this.state.user.userId
        }

        this.props.spaceHandler(subSpace)
        e.preventDefault();
    }

    render() {
        let form;
        if (this.state.user.userId > 0) {
            form = (
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
        } else {
            form = <p>Waiting for space.</p>
        }
        return (
            <div>
                {form}
            </div>
        )
    }
}
export default UpdateSpaceForm