import React from 'react'
import {setFormHeader,toggleIsVis} from './utils/formUtils'

class Exits extends React.Component {
    constructor(props) {
        super(props)
        this.state = {vis: true}
    }
    
    handleHeaderClick = (e) => {
        this.setState(toggleIsVis(this.state))
    }

    formatSpaces = () => {
        if (this.props.spaces)
        return this.props.spaces.map((value,i) => <option key={i} value={value.spaceId}>{value.title}</option>)
    }
    formatExits = () => {
        console.log(this.props.inPlace)
        if (typeof(this.props.inPlace) === 'undefined' || this.props.inPlace.exits === null) return <div></div>
        const exits = this.props.inPlace.exits
        let exitsArray=[]

        for (const [key, value] of Object.entries(exits)) {
            const inObj = {
                name: key,
                title: value.title
            }
            exitsArray.push(inObj)
        }

    return exitsArray.map((exit,i) => <span key={exit.name}>{exit.name} - {exit.title}</span>)
    }

    render() {
        return (
            <div>
            <div>{setFormHeader("Exits", this.handleHeaderClick)}</div>
            <div>{this.formatExits()}</div>
            </div>
        )
    }
}

export default Exits
