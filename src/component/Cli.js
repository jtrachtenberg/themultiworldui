import React from 'react'
import {handleInputChange, updateHandler} from './utils/formUtils'
import {ReactComponent as SendIcon} from './sendCommand.svg';
import * as GlobalCommands from './globalCommands/globalCommands'
import * as AdminCommands from './adminCommands/adminCommands'
import * as Constants from './constants'
import ReactPlayer from 'react-player'
import {isMobile,isFirefox, isSafari} from 'react-device-detect'
import {disambiguation} from './utils/disambiguation'

class Cli extends React.Component {
    constructor(props) {
        super(props)
        this.state = { chatMode: false, forceOpen: false, modalReturn: {}, currentPlaying: 0, playingPlace: true, disabled: false, loadCommands: true, user: props.inUser, currentInput: "", availableCommands: null, results: <span></span>, placeId: Constants.DEFAULT_PLACE, place: this.props.inPlace}
        this.resultRef = React.createRef()
    }  

    loadCommands = () => {

        let commands = []
        for (const [key, value] of Object.entries(GlobalCommands)) {
            commands.push({[key]: value})
        }

        if (this.props.isAdmin) {
            for (const [key, value] of Object.entries(AdminCommands)) {
                commands.push({[key]: value})
            }
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
                if (typeof object.type !== 'undefined' && object.type === 'NPC') {
                    console.log('object',object)
                }
                else {
                    const actionStack = typeof object.actionStack === 'string' ? JSON.parse(object.actionStack.replace(/\\/g, "")) : object.actionStack||[]
                    console.log('actionStack',actionStack)
                    if (Array.isArray(actionStack)) {
                        actionStack.forEach(action => {
                            const funcArray = []
                            if (action.key === "Command") {
                                action.elementList.forEach(element => {
                                    if (!Array.isArray(element.selectedElement)) {//Simple string response
                                        const retFunction = (props, inputParts) => {
                                            const retVal = new Promise((resolve) => resolve(element.commandResult))
                                            return retVal
                                        }
                                        funcArray.push(retFunction)
                                    }
                                    else {
                                        const retFunction = (props, inputParts) => {
                                            const retVal = new Promise((resolve) => {
                                                let result = element.commandResult
                                                
                                                if (element.elementType === 'replace') {
                                                // eslint-disable-next-line
                                                    const replaceFunc = new Function(element.elementResult.function.arguments, element.elementResult.function.body)
                                                    const replace = replaceFunc(element.elementFormat)
                            
                                                    result = result.replace(element.elementSymbol.toLowerCase(), replace.toLowerCase())
                                                } else if (element.elementType === 'action') {
                                                    // eslint-disable-next-line
                                                    const actionFunc = new Function(element.elementResult.function.arguments, element.elementResult.function.body)

                                                    result = actionFunc(element.elementFormat, props, inputParts, this, React, ReactPlayer, isSafari)
                                                }
                                                
                                                resolve(result)
                                            })
                                            return retVal
                                        }
                                        funcArray.push(retFunction)
                                    }
                                })
                            }

                            commands.push({[action.commandAction]:funcArray,isBroadcast:true,objTitle:object.title})
                        })
                    } else {//NPC

                    }
                }
            })

            if (this.props.inUser.userId > 0 && this.props.inUser.state !== null & typeof(this.props.inUser.stateData) !== 'undefined' && typeof(this.props.inUser.stateData.inventory) !== 'undefined' && Array.isArray(this.props.inUser.stateData.inventory) && this.props.inUser.stateData.inventory.length > 0)
            this.props.inUser.stateData.inventory.forEach(object => {
                const actionStack = typeof object.actionStack === 'string' ? JSON.parse(object.actionStack.replace(/\\/g, "")) : object.actionStack
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
        if (isMobile) this.setState({playingPlace:false})          
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

        if (this.props.inMsg !== "" && (prevProps.inMsg !== this.props.inMsg)) {
            let prepend = <span></span>
            if (Object.keys(this.props.inSnd).length === 0 && this.props.inSnd.constructor === Object) {
                let formatMsg
                if (typeof this.props.inMsg === 'object') formatMsg = this.props.inMsg
                else formatMsg = <span>{this.props.inMsg}</span>
                this.formatResults(formatMsg,{},() => {
                    this.resultRef.current.scrollTop = this.resultRef.current.scrollHeight
                    this.props.messageResetHander()
                    this.props.audioResetHandler()
                })
            }
            else {
                    prepend = <span className="inlineAudio"><ReactPlayer playing={false} width={isSafari ? "44px" : "102px"} height="20px" controls={true} url={this.props.inSnd.src} />&nbsp;</span>
                    this.formatResults(<span>{prepend}{this.props.inMsg}</span>,{},() => {
                        this.resultRef.current.scrollTop = this.resultRef.current.scrollHeight
                        this.props.messageResetHander()
                        this.props.audioResetHandler()
                    })
            }

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
        rulesets.push({
            'type':'trigger',
            'search':'sayaudio',
            'searchType':'exact',
            'pos':0,
            'setState':'forceOpen',
            'stateValue':'true'
        })
        const cmds = [];
        this.state.availableCommands.forEach((cmd)=> {
            Object.keys(cmd).forEach((key) => {
                cmds.push(`${key}`)
                cmds.push(`${key.charAt(0).toUpperCase() + key.slice(1)}`)
            })
        })
 
        /*const regexp = new RegExp(`^${cmds.join('|')}|help|Help$`)
        rulesets.push({
            'type':'validate',
            'invert': true,
            'regexp': regexp,
            'state':'disabled'
        })*/
        this.setState(handleInputChange(e,rulesets))
    }

    formatResults = (newLine, stateData, callback) => {
        let newResult
        console.log('newLine',newLine)
        if (this.state.results === <span></span>)
            newResult = <span>{newLine}</span>
        else
            newResult = <span><span>{this.state.results}</span><br/><span>{newLine}</span></span>
        this.setState({
            results: newResult,
            ...stateData
        },callback)
    }
    
    processCommandResult = (result,executeCommand) => {
        const origResult = result
            if (Array.isArray(result)) {//disambiguation
                let response = result[0].retResult
                let diCmd = result[0].cmd
                let diTarget = result[0].target
                let diArray = result[1]
                console.log(diTarget)
                const stateData = {currentInput: "", diCmd: diCmd, diArray: diArray,diTarget:diTarget}
                this.formatResults(response, stateData, () => {
                    this.resultRef.current.scrollTop = this.resultRef.current.scrollHeight
                })
            }
            else if (typeof(result) === 'object') {
                if (result.type === 'place') {
                    const newUser = this.props.inUser
                    newUser.stateData.newRoom = result.value.placeId
                    newUser.stateData.currentSpace = result.value.spaceId
                    const stateData = {currentInput: "", loadCommands: true}
                    this.formatResults(result.response, stateData, () => {
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
                    place.objects = result.value
                    const stateData = {currentInput: "", loadCommands: true}
                    this.formatResults(result.response, stateData, () => {
                        updateHandler("place", place, this.props.childUpdateHandler,true)
                        this.resultRef.current.scrollTop = this.resultRef.current.scrollHeight
                        if (typeof result.msg !== 'undefined') {
                            this.props.socket.emit('incoming data', {msg: result.msg, msgPlaceId: this.props.inPlace.placeId, userName: ""})
                            this.cliInput.focus()
                        }
                    })
                }
            }
            else {
                const stateData = {currentInput: "",loadCommands: true}
                this.formatResults(result, stateData, () => {
                    this.resultRef.current.scrollTop = this.resultRef.current.scrollHeight
                    if (executeCommand.isBroadcast) {
                        const message = `${this.props.inUser.userName} uses ${executeCommand.objTitle}: ${origResult}`
                        this.props.socket.emit('incoming data', {msg: message, msgPlaceId: this.props.inPlace.placeId, userName: ""})

                    }
                })
        }
    }



    handleCommand = async (e) => {
        e.preventDefault()
        if (typeof this.state.diCmd === 'string' && this.state.diCmd.length > 0) {//diambiguation
            const input = this.state.currentInput
            const inputParts = input.split(" ")
            let selectedNum = Number(inputParts[0])
            if (selectedNum < 0 || selectedNum > this.state.diArray.length) {
                this.formatResults("Please select from the list above.",{currentInput: ""},() => {
                    this.resultRef.current.scrollTop = this.resultRef.current.scrollHeight
                })
                return
            }
            const selectedItem = this.state.diArray[selectedNum-1]
            console.log(selectedItem)
            if (typeof selectedItem === 'undefined') {
                this.formatResults("Please select from the list above.",{currentInput: ""},() => {
                    this.resultRef.current.scrollTop = this.resultRef.current.scrollHeight
                })
                return
            } else if (Array.isArray(selectedItem[this.state.diCmd])) {
                console.log(this.state.diTarget)
                selectedItem[this.state.diCmd].forEach(cmd => cmd(this.props, inputParts,this.state.modalReturn).then(result => this.setState({diCmd:"",diArray:[],diTarget:""},() => this.processCommandResult(result,selectedItem,() => {
                    this.resultRef.current.scrollTop = this.resultRef.current.scrollHeight
                })))
                .catch(failed => {
                    console.log(failed)
                }) 
            ) 
            } else if (typeof selectedItem[this.state.diCmd] === 'function') {
                console.log(this.state.diTarget)
                const inputParts = [this.state.diCmd]
                if (typeof this.state.diTarget === 'string' && this.state.diTarget.length > 0) inputParts.push(this.state.diTarget)
                selectedItem[this.state.diCmd](this.props, inputParts, this.state.modalReturn).then(result => this.setState({diCmd:"",diArray:[],diTarget:""},() => this.processCommandResult(result,selectedItem,() => {
                    this.resultRef.current.scrollTop = this.resultRef.current.scrollHeight
                })))
                    .catch(failed => {
                        console.log(failed)
                    }) 
            
            } else {
                const availableCommands = this.state.availableCommands
                let search = this.state.diCmd
                const executeCommand = availableCommands.find((cmd) => {
                    let cmdCheck
                    Object.keys(cmd)
                        .forEach(function eachKey(key) { 
                            console.log(key)
                            console.log(search)
                            if (key.toLowerCase() === search.toLowerCase()) {
                                //reset incase of case mismatch
                                cmdCheck = key
                                search = key
                            }
                        })
                        return cmdCheck === search
                })
                const action = executeCommand[search]
                const actionItem = {
                    src: 'disambigulation',
                    type: selectedItem.type,
                    obj: selectedItem.value,
                    target: this.state.diTarget,
                    inUser: this.props.inUser,
                    inPlace: this.props.inPlace
                }
                action(actionItem, inputParts, this.state.modalReturn).then(result => {
                    
                    this.setState({diCmd:"",diArray:[],diTarget:""},() => this.processCommandResult(result,executeCommand))         
                })
                .catch(failed => {
                    console.log(failed)
                }) 
            }
        } else if (this.state.chatMode) {
            let cmdString = 'say'
            const executeCommand = this.state.availableCommands.filter((cmd) => {
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
            const action = executeCommand[0]['say']
            const input = this.state.currentInput
            const inputParts = input.split(" ")
            const msg = ['say',...inputParts]
            action(this.props, msg, this.state.modalReturn).then(result => this.processCommandResult(result,executeCommand))
                    .catch(failed => {
                        console.log(failed)
                    })      
        } else {
        
            const availableCommands = this.state.availableCommands
            const input = this.state.currentInput
            const inputParts = input.split(" ")
            let cmdString = inputParts[0]
            console.log(cmdString)
            if (cmdString === 'help' || cmdString === 'Help') {
                const cmds = [];
                availableCommands.forEach((cmd)=> {
                    Object.keys(cmd).forEach((key) => {
                        if (key !== 'isBroadcast' && key !== 'objTitle')
                            cmds.push(`${key}`)
                    })
                })
                const cmdString = cmds.join(", ")
                const stateData = {currentInput: "", loadCommands: true}
                this.formatResults(`Available commands: ${cmdString}`, stateData, () => {
                    this.resultRef.current.scrollTop = this.resultRef.current.scrollHeight
                })
                return 
            }

            const executeCommand = availableCommands.filter((cmd) => {
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
            if (Array.isArray(executeCommand) && executeCommand.length === 1) {
            
                const action = executeCommand[0][cmdString]
                if (Array.isArray(action)) {//object command
                    action.forEach(cmd => cmd(this.props, inputParts,this.state.modalReturn).then(result => this.processCommandResult(result,executeCommand))
                        .catch(failed => {
                            console.log(failed)
                        }) 
                    )       
                }
                else if (typeof(action) === 'function') {//Global command
                    action(this.props, inputParts, this.state.modalReturn).then(result => this.processCommandResult(result,executeCommand))
                    .catch(failed => {
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
            } else if (Array.isArray(executeCommand) && executeCommand.length > 1) {
                disambiguation(executeCommand,cmdString,inputParts[1]||null).then(response => {
                    console.log(response)
                    const stateData={
                        diCmd: response[0].cmd,
                        diArray: response[1],
                        diTarget: response[0].target,
                        currentInput: ""
                    }
                    this.formatResults(response[0].retResult,stateData,() => {
                        this.resultRef.current.scrollTop = this.resultRef.current.scrollHeight
                    })
                })
                
            }else {//invalid command
                this.formatResults("Nothing to do here.",{},()=>{})
            }
        }
    }

    formatAudio = () => {
        const audio = this.props.inPlace.audio
        if (Array.isArray(audio) && audio.length > 0)
            //return audio.map((value,i) => <span key={i}></span>)
    return audio.map((value,i) => <span key={i} className="audioContainer"><ReactPlayer playing={this.state.playingPlace} width="1px" height="1px" controls={false} url={value.src} />{!isFirefox && <embed width="0" height="0" autostart="1" src={value.src} />}</span>)
    //return audio.map((value,i) => <span key={i} className="audioContainer">{audioContext(value.src)}</span>)
      }
      handlePlayPause = (e) => {
          e.preventDefault()
        this.setState({ playingPlace: !this.state.playingPlace })
      }
      handleInlinePlayPause = (e) => {
        e.preventDefault()
      this.setState({ inlinePlaying: !this.state.inlinePlaying })
    }
    setModalReturn = (inModalReturn) => {
        let newInput = this.state.currentInput.trim()
        if (typeof inModalReturn !== 'undefined' && typeof inModalReturn.name !== 'undefined')
            newInput = newInput + ' ' + inModalReturn.name.split(' ').join('_') + ' ';
        this.setState({modalReturn: inModalReturn, currentInput: newInput, forceOpen: false})
        this.cliInput.focus()
      }

    render() {
        return (
                <div>
                <form id="Cli">
                    <section>
                        <div ref={this.resultRef} name="resultsWindow" className="resultsWindow">{this.state.results}</div>
                    </section>
                    <section className="inputText">
                    <span>
                        <input type="search" spellCheck="false" autoComplete="off" autoCorrect="off" autoCapitalize="off" ref={(input) => { this.cliInput = input; }} name="currentInput" className="cli" value={this.state.currentInput} onChange={this.handleChange} />
                    <button name="send" onClick={this.handleCommand} disabled={this.state.disabled}> 
                    <SendIcon />
                    </button>
                    <span className="cliPlayButton">{this.formatAudio()}{(Array.isArray(this.props.inPlace.audio) && this.props.inPlace.audio.length > 0) && <button onClick={this.handlePlayPause}>{ this.state.playingPlace ? <img alt="pause" src="https://img.icons8.com/android/24/000000/pause.png"/> : <img alt="play" src="https://img.icons8.com/android/24/000000/play.png"/>}</button> }</span>
                    <span className="cliAudioSearch"><button className={this.state.chatMode ? 'chatModeOn' : 'chatModeOff'} onClick={(e) => {
                        this.setState({chatMode: !this.state.chatMode});e.preventDefault()}}><img alt="chat" src="https://img.icons8.com/fluent-systems-regular/24/000000/filled-chat.png"/></button></span>
                    </span>
                    </section>
                </form>
                </div>
        )
    }
}

export default Cli