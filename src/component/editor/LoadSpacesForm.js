import React from 'react';
import {setFormHeader, toggleIsVis} from '../utils/formUtils'

class LoadSpacesForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            vis: false,
            loaded: false
        }
    }

    componentDidUpdate() {
        if (this.props.inUser.userId > 0 && (typeof(this.props.spaces) !== 'undefined') && !this.state.loaded) {
            this.setState({
                loaded: true
            }, this.props.loadSpace(this.props.spaces[0].spaceId))
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
    }

    formatSpaces = () => {
        if (this.props.spaces)
        return this.props.spaces.map((value,i) => <option key={i} value={value.spaceId}>{value.title}</option>)
    }
    handleChange = (e) => {
        console.log(e.target.value)
        this.props.loadSpace(Number(e.target.value))
    }

    handleHeaderClick = (e) => {
        this.setState(toggleIsVis(this.state))
    }

    render() {
        if (this.props.inUser.userId < 1)
        return (
        <div></div>
        )
        else
        return (
        <div>
        <div>{setFormHeader("Select a space")}</div>
        <form><select onChange={this.handleChange}>
            <option value="" disabled>Select a Space</option>
            {this.formatSpaces()}
        </select></form>
        </div>
        )
    }
}
export default LoadSpacesForm