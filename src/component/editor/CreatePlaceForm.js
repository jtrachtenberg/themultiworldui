import React from 'react';
import {setFormHeader} from '../utils/formUtils'
import {handleInputChange} from '../utils/formUtils'

class CreatePlaceForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            user: props.inUser,
            space: props.inSpace, 
            place: props.inPlace, 
            title: props.inPlace.title,
            description: props.inPlace.description,
            isRoot: props.inPlace.isRoot
        }
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
        var inPlace = this.state.place
        if (inPlace.placeId !== this.props.inPlace.placeId)
            this.setState({
                place: this.props.inPlace,
            })
    }

    handleChange = (e) => {
        this.setState(handleInputChange(e))
    }

    handleSubmit = (e) => {
        console.log('handleSubmit')
        const place = this.state.place
        place.title = this.state.title
        place.description = this.state.description
        place.isRoot = this.state.isRoot
        place.userId = this.state.user.userId
        place.spaceId = this.space.spaceId
        this.props.placeHandler(place)
        e.preventDefault();
    }

    render() {
        if (this.state.space.spaceId === 0)
        return (
        <div>
        <div>{setFormHeader("Create Place")}</div>
        <div></div>
        </div>
        )
        if (this.state.space.spaceId < 1 && this.state.user.userId > 0 && this.state.place.placeId < 1)
        return (
            <div>
            <div>{setFormHeader("Create Place")}</div>
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
        <div>{setFormHeader(this.state.place.title+" Loaded Successfully")}</div>
        </div>
        )
    }
}

export default CreatePlaceForm