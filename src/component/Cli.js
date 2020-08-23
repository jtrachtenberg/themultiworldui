import React from 'react'
import {handleInputChange} from './utils/formUtils'
import {downArrowBlack} from './utils/svgDefaults'
import * as GlobalCommands from './globalCommands/globalCommands'
import * as Constants from './constants'

class Cli extends React.Component {
    constructor(props) {
        super(props)
        this.state = {disabled: true, loadCommands: true, user: props.inUser, currentInput: "", availableCommands: null, results: "", placeId: Constants.DEFAULT_PLACE, place: this.props.inPlace}
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

        if (Array.isArray(this.props.inPlace.objects) && this.props.inPlace.objects.length > 0)
            this.props.inPlace.objects.forEach(object => {
                const actionStack = JSON.parse(object.actionStack.replace(/\\/g, ""))
                actionStack.forEach(action => {
                    if (action.command === "Command")
                        if (!Array.isArray(action.elementList)) {//Simple string response
                            const retFunction = () => {
                                const retVal = new Promise((resolve) => resolve(action.commandResult))
                                return retVal
                            }
                            commands.push({[action.commandAction]:retFunction,isBroadcast:true,objTitle:object.title})
                        }
                })
            })

        this.setState({
            availableCommands: commands,
            loadCommands: false
        })
    }

    componentDidUpdate(prevProps) {

        if (this.props.inPlace && (prevProps.inPlace !== this.props.inPlace)) {
            this.setState({
                placeId: this.props.inPlace.placeId,
                place: this.props.place
            },this.loadCommands())
        } else if (this.props.inPlace.updated) {
            this.props.inPlace.updated = false
            this.loadCommands()
        }

        if (prevProps.inMsg !== this.props.inMsg) {
            let result
            if (this.state.results.length === 0)
            result = this.props.inMsg
            else
            result = 
`${this.state.results}
${this.props.inMsg}`
            this.setState({
                results: result,
            },() => {
                this.resultRef.current.scrollTop = this.resultRef.current.scrollHeight
            })
        }
    }

    handleChange = (e) => {
        const rulesets = []
        rulesets.push({
            'type':'transform',
            'search':`'`,
            'pos':0,
            'replace':'say '
        })
        const cmds = [];
        this.state.availableCommands.forEach((cmd)=> {
            Object.keys(cmd).forEach((key) => {
                cmds.push(`${key}`)
                cmds.push(`${key.charAt(0).toUpperCase() + key.slice(1)}`)
            })
        })
 
        const regexp = new RegExp(`^${cmds.join('|')}|help|Help$`)
        rulesets.push({
            'type':'validate',
            'invert': true,
            'regexp': regexp,
            'state':'disabled'
        })
        this.setState(handleInputChange(e,rulesets))
    }

    handleCommand = async (e) => {

        e.preventDefault()
        const availableCommands = this.state.availableCommands
        const input = this.state.currentInput
        const inputParts = input.split(" ")
        let cmdString = inputParts[0]
        if (cmdString === 'help' || cmdString === 'Help') {
            const cmds = [];
            availableCommands.forEach((cmd)=> {
                Object.keys(cmd).forEach((key) => {
                    if (key !== 'isBroadcast' && key !== 'objTitle')
                        cmds.push(`${key}`)
                })
            })
            const cmdString = cmds.join(",")
            const resultStr = this.state.results.length === 0 ?
                `Available commands: ${cmdString}` :                      
`${this.state.results}
Available commands: ${cmdString}`
            this.setState({
                results: resultStr,
                currentInput: "",
                loadCommands: true
            },() => {
                this.resultRef.current.scrollTop = this.resultRef.current.scrollHeight
            })
            return 
        }

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
        console.log(executeCommand)
        const action = executeCommand[cmdString]
        if (typeof(action) === 'function') {//Global command
            action(this.props, inputParts).then(result => {
                const origResult = result
                if (typeof(result) === 'object') {
                    if (result.type === 'place') {
                        const newUser = this.props.inUser
                        newUser.stateData.currentRoom = result.placeId
                        newUser.stateData.currentSpace = result.spaceId
                        const resultStr = this.state.results.length === 0 ?
                        `Traveling to the world of ${inputParts[1]}` :                      
`${this.state.results}
Traveling to the world of ${inputParts[1]}`
                        this.setState({
                            results: resultStr,
                            currentInput: "",
                            loadCommands: true
                        },() => {
                            this.props.updateUserHandler(newUser)
                            this.resultRef.current.scrollTop = this.resultRef.current.scrollHeight
                        })
                    }
                }
                else {
                if (this.state.results.length > 0) //string
                result = 
`${this.state.results}
${result}`
                this.setState({
                    results: result,
                    currentInput: "",
                    loadCommands: true
                },() => {
                    this.resultRef.current.scrollTop = this.resultRef.current.scrollHeight
                    if (executeCommand.isBroadcast) {
                        console.log('broadcast')
                        const message = `${this.props.inUser.userName} uses ${executeCommand.objTitle}: ${origResult}`
                        this.props.socket.emit('incoming data', {msg: message, msgPlaceId: this.props.inPlace.placeId, userName: ""})

                    }
                })
            }
            }).catch(failed => {
                console.log(failed)
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
                    <button name="send" onClick={this.handleCommand} disabled={this.state.disabled}>
                    {downArrowBlack}
                    </button>
                    </span>
                    </section>
                </form>
        )
    }
}

export default Cli