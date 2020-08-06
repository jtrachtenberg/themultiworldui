import React from 'react'
import {handleInputChange} from './utils/formUtils'
import {downArrowBlack} from './utils/svgDefaults'
import * as GlobalCommands from './globalCommands/globalCommands'

class Cli extends React.Component {
    constructor(props) {
        super(props)
        this.state = {user: props.inUser, currentInput: "", availableCommands: Object.keys(GlobalCommands), results: ""}
    }  

    loadCommands = () => {
        //const exits = this.props.inPlace.exits
        this.setState({
            availableCommands: Object.keys(GlobalCommands)
        })
    }

    handleChange = (e) => {
        this.setState(handleInputChange(e))
        console.log(Object.keys(GlobalCommands))
    }

    handleCommand = (e) => {
        e.preventDefault()
        console.log(e)
        const cmd = this.state.currentInput
        if (this.state.availableCommands.find((cmd) => {
            return cmd === this.state.currentInput
        })) {
            let result
            if (this.state.results.length === 0)
                result = GlobalCommands[cmd]()
            else
            result = 
`${this.state.results}
${GlobalCommands[cmd]()}`
            this.setState({
                results: result,
                currentInput: ""
            })
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