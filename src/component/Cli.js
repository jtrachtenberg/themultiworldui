import React from 'react'
import {handleInputChange} from './utils/formUtils'

class Cli extends React.Component {
    constructor(props) {
        super(props)
        this.state = {user: props.inUser, currentInput: ""}
    }  

    handleChange = (e) => {
        handleInputChange(e, this)
    }

    handleCommand = (e) => {
        e.preventDefault()
    }

    render() {
        return (
                <form id="Cli">
                    <section>
                    <span><input type="text" name="currentInput" className="cli" value={this.state.currentInput} onChange={this.handleChange} /><button name="send" onClick={this.handleCommand}>&#8594;</button></span>
                    </section>
                </form>
        )
    }
}

export default Cli