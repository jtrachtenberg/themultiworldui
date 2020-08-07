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
        console.log(typeof(this.props.inPlace.exits))
        if (Array.isArray(this.props.inPlace.exits)) {

        const exits = this.props.inPlace.exits

        exits.forEach(exit => {
         for (const [key,value] of Object.entries(exit)) {
            const exitObj = {
                [key]:value
            }
            commands.push(exitObj)
         }
        })
        }

        this.setState({
            availableCommands: commands,
            loadCommands: false
        })
    }

    componentDidUpdate() {
        console.log(`${this.state.placeId}:${this.props.inPlace.placeId}`)
        if (this.state.loadCommands && this.props.inPlace.placeId !== this.state.placeId) {

            this.setState({
                placeId: this.props.inPlace.placeId
            }, this.loadCommands())
        }
    }

    handleChange = (e) => {
        this.setState(handleInputChange(e))
    }

    handleCommand = async (e) => {
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
        let getResult = await action(this.props.inPlace, inputParts).then(result => result)
        let result

        if (this.state.results.length === 0)
            result = getResult
        else
        result = 
`${this.state.results}
${getResult}`
        this.setState({
            results: result,
            currentInput: "",
            loadCommands: true
        })
        } else if (typeof(action) === 'object') {
            console.log(action)
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