import React from 'react';
import {setFormHeader, handleInputChange, createHandler, toggleIsVis} from '../utils/formUtils'
import * as Constants from '../constants'

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
            isRoot: false,
            isExit: false,
            cmd: ""
        }
    }

    componentDidUpdate() {
        var inPlace = this.state.place
        if (inPlace.placeId !== this.props.inPlace.placeId) {
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
        const place = this.state.place
        const prevPlace = this.props.inPlace
        place.title = this.state.title
        place.description = this.state.description
        place.isRoot = this.state.isRoot
        place.spaceId = this.props.inSpace.spaceId
        let exits = []
        const cmd = this.state.cmd.length > 0 ? this.state.cmd : prevPlace.title.split(" ")[0]
        if (this.state.isExit) {
            exits.push({[cmd]:{placeId:prevPlace.placeId,title:prevPlace.title}})
        }
        place.exits = exits

        createHandler("place", place, this.props.placeHandler)
        this.setState({
            title: "",
            description: "",
            isRoot: false,
            isExit: true
        })
    }

    handleHeaderClick = (e) => {
        this.setState(toggleIsVis(this.state))
    }

    render() {
        if (this.props.inUser.userId < 1)
        return (
        <div></div>
        )
        else if (this.props.inSpace === null || typeof(this.props.inSpace) == 'undefined' || this.props.inSpace.spaceId === 0 || this.props.inSpace.spaceId === Constants.DEFAULT_SPACE)
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
                value={this.state.isRoot}
                checked={this.state.isRoot}
                onChange={this.handleChange} />
            </label>
            <label>Add as Exit?</label>
            <input name="isExit" type="checkbox" value={this.state.isExit} checked={this.state.isExit} onChange={this.handleChange} />  
            <label>Exit Command</label><input name="cmd"  type="text" value={this.state.cmd} onChange={this.handleChange}  /> 
            <input type="submit" value="Submit" />
            </form>
            </div>
            </div>
        )
    }
}

export default CreatePlaceForm