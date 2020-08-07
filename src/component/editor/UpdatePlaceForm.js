import React from 'react';
import {setFormHeader, handleInputChange, updateHandler, toggleIsVis} from '../utils/formUtils'

class UpdatePlaceForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            vis: true,
            user: props.inUser,
            space: props.inSpace, 
            place: props.inPlace, 
            title: props.inPlace.title,
            description: props.inPlace.description,
            isRoot: props.inPlace.isRoot,
            isExit: true,
            exits: props.inPlace.exits,
            poi: props.inPlace.poi,
            objects: props.inPlace.objects,
            disabled: false
        }
    }

    componentDidUpdate() {
        var inPlace = this.state.place
        if (inPlace !== this.props.inPlace) {
            this.setState({
                place: this.props.inPlace,
                title: this.props.inPlace.title,
                description: this.props.inPlace.description,
                isRoot: this.props.inPlace.isRoot,
                exits: this.props.inPlace.exits,
                poi: this.props.inPlace.poi,
                objects: this.props.inPlace.objects
            },() => {
                const poi = this.state.poi
                let stateArray = {}
                if (Array.isArray(poi)) {
                    poi.forEach((element) => {
                        stateArray[element.word] = element.description
                        //stateArray.push({[element.word]:[element.description]})
                    })
                    this.setState({...stateArray})
                }
                    
            })
        }
    }

    handleChange = (e) => {
        this.setState(handleInputChange(e))
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.disabled) {
            return
        }
        this.setState({
            disabled: true
        })
        const place = this.state.place
        place.title = this.state.title
        place.description = this.state.description
        place.isRoot = this.state.isRoot
        place.spaceId = this.props.inSpace.spaceId
        place.exits = this.props.inPlace.exits

        const poi = []
        this.state.poi.forEach((element) => {
            element.description = this.state[element.word]
            poi.push(element)
        })
        place.poi = poi
        updateHandler("place", place, this.props.placeHandler)
        this.setState({
            disabled: false
        })
    }

    handleHeaderClick = (e) => {
        this.setState(toggleIsVis(this.state))
    }

    formatPoi = () => {
        if (Array.isArray(this.props.inPlace.poi))
        return this.props.inPlace.poi.map((value,i) => 
        <section key={i}><label>Keyword {value.word}</label>
        <input name={value.word} type="text" value={this.state[value.word]||''} onChange={this.handleChange} />
        </section>
        )
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
            <div>{setFormHeader("Update Place", this.handleHeaderClick)}</div>
            <div>
            <form className={this.state.vis ? "n" : "invis"} onSubmit={this.handleSubmit}>
                <section>
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
            <label>Add as Exit?</label>
            <input name="isExit" type="checkbox" checked={this.state.isExit} onChange={this.handleChange} />
            </section>
            <section>
                {this.formatPoi()}
            </section>
            <button onClick={this.handleSubmit} disabled={this.state.disabled}>{this.state.disabled ? 'Updating' : 'Save'}</button>
            </form>
            </div>
            </div>
        )
    }
}

export default UpdatePlaceForm