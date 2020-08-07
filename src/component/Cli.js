import React from 'react'
import {handleInputChange} from './utils/formUtils'
import {downArrowBlack} from './utils/svgDefaults'
import * as GlobalCommands from './globalCommands/globalCommands'

class Cli extends React.Component {
    constructor(props) {
        super(props)
        this.state = {loadCommands: true, user: props.inUser, currentInput: "", availableCommands: null, results: "", placeId: 0, place: this.props.inPlace}
        this.resultRef = React.createRef()
    }  

    loadCommands = () => {

        let commands = []
        for (const [key, value] of Object.entries(GlobalCommands)) {
            commands.push({[key]: value})
        }
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

    componentDidUpdate(prevProps) {
        if (prevProps.inPlace !== this.state.place && this.state.loadCommands) {
            this.setState({
                placeId: this.props.inPlace.placeId,
                place: this.props.place
            },this.loadCommands())
        }
    }

    handleChange = (e) => {
        this.setState(handleInputChange(e))
    }

    handleCommand = async (e) => {
        e.preventDefault()
        const input = this.state.currentInput
        const inputParts = input.split(" ")
        let cmdString = inputParts[0]
        const availableCommands = this.state.availableCommands

        const executeCommand = availableCommands.find((cmd) => {
            let cmdCheck
            Object.keys(cmd)
                .forEach(function eachKey(key) { 
                    if (key.toLowerCase() === cmdString.toLowerCase()) {
                        //reset incase of case mismatch
                        cmdCheck = key
                        cmdString = key
                    }
                })
                return cmdCheck === cmdString
        })
        if (typeof(executeCommand) !== 'undefined') {
        const action = executeCommand[cmdString]
        if (typeof(action) === 'function') {//Global command
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
        },() => {
            this.resultRef.current.scrollTop = this.resultRef.current.scrollHeight
        })
        } else if (typeof(action) === 'object') {//exit
            const newPlaceId = action.placeId
            const newUser = this.props.inUser
            newUser.stateData.currentRoom = newPlaceId
            this.setState({
                results: "",
                currentInput: "",
                loadCommands: true
            },this.props.updateUserHandler(newUser))
        }
        } else {//invalid command
            let result
            if (this.state.results.length === 0)
                result = "Nothing to do here."
             else
                result = 
`${this.state.results}
Nothing to do here.`
            this.setState({
                results: result
            })
        }
    }

    render() {
        return (
                <form id="Cli">
                    <section>
                        <textarea ref={this.resultRef} name="resultsWindow" className="resultsWindow" readOnly value={this.state.results} />
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