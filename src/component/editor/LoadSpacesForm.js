import React from 'react';
import {setFormHeader} from '../utils/formUtils'

class LoadSpacesForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            user: props.inUser,
            space: props.inSpace
        }
    }

    componentDidUpdate() {
        if (this.state.user !== this.props.user) {
            this.setState({
                user: this.props.user
            })
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

    render() {
        if (this.props.inUser && this.props.inUser.userId && this.props.inUser.userId < 1)
        return (
        <div></div>
        )
        else
        return (
        <div>
        <div>{setFormHeader("Select a space")}</div>
        <form><select onChange={this.handleChange}>{this.formatSpaces()}</select></form>
        </div>
        )
    }
}
export default LoadSpacesForm