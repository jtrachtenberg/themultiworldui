import React from 'react';

class Alert extends React.Component {
    constructor(props) {
        super(props)
        this.state = {timerId: 0,message: props.message, isVis: props.isVis, success: props.success}
    }

    formatName(inUser) {
        if (inUser.userId > 0)
        return <h1>Hello, {inUser.userName}!</h1>
        else return <h1>Create or load a User</h1>
    }

    componentDidUpdate() {
        console.log('alert did update')
        console.log(this.state.message)
        console.log(this.props.message)
        var message = this.state.message
        if (message !== this.props.message)
            this.setState({
                message: this.props.message,
                isVis: this.props.isVis,
                success: this.props.success
            })
        if (this.state.isVis)
            this.timerID = setInterval(
                () => this.tick(), 3000
            )
    }

    tick() {
        this.setState({
            isVis: false,
        })
        clearTimeout(this.timerID)
    }
    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <div className={`alert success-${this.state.success} ${this.state.isVis ? 'alert-shown' : 'alert-hidden'}`}>
        <strong>{this.state.message}</strong>
            </div>
        )
    }
}

export default Alert