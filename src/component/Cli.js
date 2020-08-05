import React from 'react'
import {handleInputChange} from './utils/formUtils'
import {downArrowBlack} from './utils/svgDefaults'

class Cli extends React.Component {
    constructor(props) {
        super(props)
        this.state = {user: props.inUser, currentInput: ""}
    }  

    handleChange = (e) => {
        this.setState(handleInputChange(e))
    }

    handleCommand = (e) => {
        e.preventDefault()
    }

    render() {
        return (
                <form id="Cli">
                    <section>
                    <span><input type="text" name="currentInput" className="cli" value={this.state.currentInput} onChange={this.handleChange} /><button name="send" onClick={this.handleCommand}>
                    {downArrowBlack}
                    </button></span>
                    </section>
                </form>
        )
    }
}

export default Cli