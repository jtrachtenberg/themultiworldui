import React from 'react';
import {setFormHeader, handleInputChange, createHandler, toggleIsVis} from '../utils/formUtils'

class CreatePlaceForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            vis: true,
            user: props.inUser,
            space: props.inSpace, 
            place: props.inPlace, 
            title: props.inPlace.title,
            description: props.inPlace.description,
            isRoot: props.inPlace.isRoot
        }
    }

    componentDidUpdate() {
        var inPlace = this.state.place
        if (inPlace.placeId !== this.props.inPlace.placeId) {
            console.log(inPlace)
            this.setState({
                place: this.props.inPlace,
            })
        }
    }

    handleChange = (e) => {
        this.setState(handleInputChange(e))
    }

    handleSubmit = (e) => {
        e.preventDefault();
        console.log('handleSubmit')
        const place = this.state.place
        place.title = this.state.title
        place.description = this.state.description
        place.isRoot = this.state.isRoot
        place.spaceId = this.props.inSpace.spaceId
        createHandler("place", place, this.props.placeHandler)
        this.setState({
            title: "",
            description: "",
            isRoot: false
        })
    }

    handleHeaderClick = (e) => {
        this.setState(toggleIsVis(this.state))
    }

    render() {
        if (this.props.inSpace === null || typeof(this.props.inSpace) == 'undefined' || this.props.inSpace.spaceId === 0)
        return (
        <div>
        <div>{setFormHeader("Create Place")}</div>
        <div>Select a space</div>
        </div>
        )
        else
        return (
            <div>
            <div>{setFormHeader("Create Place", this.handleHeaderClick)}</div>
            <div>
            <form className={this.state.vis ? "n" : "invis"} onSubmit={this.handleSubmit}>
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
            </div>
        )
    }
}

export default CreatePlaceForm