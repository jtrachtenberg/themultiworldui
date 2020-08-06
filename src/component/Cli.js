import React from 'react'
import {handleInputChange} from './utils/formUtils'
import {downArrowBlack} from './utils/svgDefaults'
import * as GlobalCommands from './globalCommands/globalCommands'

class Cli extends React.Component {
    constructor(props) {
        super(props)
        this.state = {loadCommands: true, user: props.inUser, currentInput: "", availableCommands: null, results: "", placeId: 0}
    }  

    loadCommands = () => {
        let commands = []
        for (const [key, value] of Object.entries(GlobalCommands)) {
            commands.push({[key]: value})
        }

        for (const [key, value] of Object.entries(this.props.inPlace.exits)) {
            commands.push({[key]:value})
        }

        this.setState({
            availableCommands: commands,
            loadCommands: false
        })
    }

    componentDidUpdate() {
        if (this.props.inPlace.exits !== null && typeof(this.props.inPlace.exits) !== 'undefined' && this.state.loadCommands && this.props.inPlace.placeId !== this.state.placeId) {
            this.setState({
                placeId: this.props.inPlace.placeId
            }, this.loadCommands())
        }
    }
    
    handleChange = (e) => {
        this.setState(handleInputChange(e))
    }

    handleCommand = (e) => {
        e.preventDefault()
        const input = this.state.currentInput
        const inputParts = input.split(" ")
        const cmdString = inputParts[0]

        const availableCommands = this.state.availableCommands

        const executeCommand = availableCommands.find((cmd) => {
            let cmdCheck
            Object.keys(cmd)
                .forEach(function eachKey(key) { 
                    if (key === cmdString) {
                        cmdCheck = key
                    }
                })
                return cmdCheck === cmdString
        })
        
        const action = executeCommand[cmdString]
        if (typeof(action) === 'function') {
        let result

        if (this.state.results.length === 0)
            result = action(this.props.inPlace, inputParts)
        else
        result = 
`${this.state.results}
${action(this.props.inPlace, inputParts)}`
        this.setState({
            results: result,
            currentInput: "",
            loadCommands: true
        })
        } else if (typeof(action) === 'object') {
            const newPlaceId = action.placeId
            const newUser = this.props.inUser
            newUser.stateData.currentRoom = newPlaceId
            this.setState({
                results: "",
                currentInput: "",
                loadCommands: true
            },this.props.updateUserHandler(newUser))
        }
    }

    render() {
        return (
                <form id="Cli">
                    <section>
                        <textarea name="resultsWindow" className="resultsWindow" readOnly value={this.state.results} />
                    </section>
                    <section>
                    <span>
                        <input type="text" name="currentInput" className="cli" value={this.state.currentInput} onChange={this.handleChange} />
                    <button name="send" onClick={this.handleCommand}>
                    {downArrowBlack}
                    </button>
                    </span>
                    </section>
                </form>
        )
    }
}

export default Cli