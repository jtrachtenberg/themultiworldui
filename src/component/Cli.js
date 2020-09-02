import React from 'react'
import {handleInputChange, updateHandler} from './utils/formUtils'
import {ReactComponent as SendIcon} from './sendCommand.svg';
import * as GlobalCommands from './globalCommands/globalCommands'
import * as Constants from './constants'
import ReactPlayer from 'react-player'
import {isMobile} from 'react-device-detect'

class Cli extends React.Component {
    constructor(props) {
        super(props)
        this.state = {playing: true, disabled: true, loadCommands: true, user: props.inUser, currentInput: "", availableCommands: null, results: "", placeId: Constants.DEFAULT_PLACE, place: this.props.inPlace}
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
                            const retFunction = (props, inputParts) => {
                                const retVal = new Promise((resolve) => resolve(action.commandResult))
                                return retVal
                            }
                            commands.push({[action.commandAction]:retFunction,isBroadcast:true,objTitle:object.title})
                        } else { //elements
                            const retFunction = (props, inputParts) => {
                                const retVal = new Promise((resolve) => {
                                    let result = action.commandResult
                                    action.elementList.forEach((element,i) =>{
                                        if (element.elementType === 'replace') {
                                        // eslint-disable-next-line
                                        const replaceFunc = new Function(element.elementResult.function.arguments, element.elementResult.function.body)
                                        const replace = replaceFunc(element.elementFormat)
    
                                        result = result.replace(element.elementSymbol, replace)
                                        }
                                    })
                                    resolve(result)
                                })
                                return retVal
                            }
                            commands.push({[action.commandAction]:retFunction,isBroadcast:true,objTitle:object.title})
                        }

                })
            })

            if (this.props.inUser.userId > 0 && this.props.inUser.state !== null & typeof(this.props.inUser.stateData) !== 'undefined' && typeof(this.props.inUser.stateData.inventory) !== 'undefined' && Array.isArray(this.props.inUser.stateData.inventory) && this.props.inUser.stateData.inventory.length > 0)
            this.props.inUser.stateData.inventory.forEach(object => {
                const actionStack = JSON.parse(object.actionStack.replace(/\\/g, ""))
                actionStack.forEach(action => {
                    if (action.command === "Command")
                        if (!Array.isArray(action.elementList)) {//Simple string response
                            const retFunction = (props, inputParts) => {
                                const retVal = new Promise((resolve) => resolve(action.commandResult))
                                return retVal
                            }
                            commands.push({[action.commandAction]:retFunction,isBroadcast:true,objTitle:object.title})
                        } else { //elements
                            const retFunction = (props, inputParts) => {
                                const retVal = new Promise((resolve) => {
                                    let result = action.commandResult
                                    action.elementList.forEach((element,i) =>{
                                        if (element.elementType === 'replace') {
                                        // eslint-disable-next-line
                                        const replaceFunc = new Function(element.elementResult.function.arguments, element.elementResult.function.body)
                                        const replace = replaceFunc(element.elementFormat)
    
                                        result = result.replace(element.elementSymbol, replace)
                                        }
                                    })
                                    resolve(result)
                                })
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
    componentDidMount() {
        this.cliInput.focus()    
        if (isMobile) this.setState({playing:false})          
    }

    componentDidUpdate(prevProps) {

        if (this.props.inPlace && (prevProps.inPlace !== this.props.inPlace)) {
            this.setState({
                placeId: this.props.inPlace.placeId,
                place: this.props.place,
                results: ""
            },this.loadCommands())
        } else if (this.props.inPlace.updated) {
            this.props.inPlace.updated = false
            this.loadCommands()
        }

        if (this.props.inMsg !== "" && (prevProps.inMsg !== this.props.inMsg)) {
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
                this.props.messageResetHander()
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
        rulesets.push({
            'type':'transform',
            'search':`/`,
            'pos':0,
            'replace':'say '
        })
        rulesets.push({
            'type':'transform',
            'search':`:`,
            'pos':0,
            'replace':'emote '
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
        const action = executeCommand[cmdString]
        if (typeof(action) === 'function') {//Global command
            action(this.props, inputParts).then(result => {
                const origResult = result
                if (typeof(result) === 'object') {
                    if (result.type === 'place') {
                        const newUser = this.props.inUser
                        newUser.stateData.newRoom = result.value.placeId
                        newUser.stateData.currentSpace = result.value.spaceId
                        const resultStr = this.state.results.length === 0 ?
                        result.response :                      
`${this.state.results}
${result.response}`
                        this.setState({
                            results: resultStr,
                            currentInput: "",
                            loadCommands: true
                        },() => {
                            this.props.updateUserHandler(newUser)
                            this.resultRef.current.scrollTop = this.resultRef.current.scrollHeight
                        })
                    } else if (result.type === 'objects') {
                        if (typeof(result.outUser) === 'object') {
                            if (Array.isArray(result.modifiers) && result.modifiers.length > 0) {
                                result.modifiers.forEach((item) => {
                                    if (typeof(item.authType) !== 'undefined')//updateAuth
                                        result.outUser.auth=item
                                })
                            }
                            this.props.updateUserHandler(result.outUser)
                        }
                        const place = this.props.inPlace
                        console.log(place.audio)
                        place.objects = result.value
                        const resultStr = this.state.results.length === 0 ?
                        result.response :                      
`${this.state.results}
${result.response}`
                        this.setState({
                            results: resultStr,
                            currentInput: "",
                            loadCommands: true
                        },() => {
                            updateHandler("place", place, this.props.childUpdateHandler,true)
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
            const newUser = Object.assign(this.props.inUser)
            newUser.stateData.newRoom = newPlaceId
            this.setState({
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

    formatAudio = () => {
        const audio = this.props.inPlace.audio
        if (Array.isArray(audio) && audio.length > 0)
          return audio.map((value,i) => <span key={i} className="audioContainer"><ReactPlayer playing={this.state.playing} width="1px" height="1px" controls={false} url={value.src} /></span>)
      }
      handlePlayPause = (e) => {
          e.preventDefault()
        this.setState({ playing: !this.state.playing })
      }
    render() {
        return (
                <div>
                <form id="Cli">
                    <section>
                        <textarea ref={this.resultRef} name="resultsWindow" className="resultsWindow" readOnly value={this.state.results} />
                    </section>
                    <section>
                    <span>
                        <input ref={(input) => { this.cliInput = input; }} type="text" name="currentInput" className="cli" value={this.state.currentInput} onChange={this.handleChange} />
                    <button name="send" onClick={this.handleCommand} disabled={this.state.disabled}> 
                    <SendIcon />
                    </button>
                    <span className="cliPlayButton">{this.formatAudio()}{(Array.isArray(this.props.inPlace.audio) && this.props.inPlace.audio.length > 0) && <button onClick={this.handlePlayPause}>{ this.state.playing ? <img alt="pause" src="https://img.icons8.com/android/24/000000/pause.png"/> : <img alt="play" src="https://img.icons8.com/android/24/000000/play.png"/>}</button> }</span>
                    </span>
                    </section>
                </form>
                </div>
        )
    }
}

export default Cli