import React from 'react';
import {setFormHeader, toggleIsVis} from '../utils/formUtils'
/*****
 * 
 * DEPRECATED: Use LoadSpacesFormHook
 */
class LoadSpacesForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            vis: false,
            loaded: false
        }
    }

    componentDidUpdate() {
        if (this.props.inUser.userId > 0 && (Array.isArray(this.props.spaces)) && this.props.spaces.length > 0 && !this.state.loaded) {
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
        else if (Array.isArray(this.props.spaces) && this.props.spaces.length > 0)
        return (
        <div>
        <div>{setFormHeader("Select a space")}</div>
        <form><select onChange={this.handleChange}>
            <option value="" disabled>Select a Space</option>
            {this.formatSpaces()}
        </select></form>
        </div>
        ) 
        else return (
            <div>
                <div>{setFormHeader("No spaces created.")}</div>
            </div>
        )
    }
}
export default LoadSpacesForm