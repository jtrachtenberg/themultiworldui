import React from 'react';

class Alert extends React.Component {
    constructor(props) {
        super(props)
        this.state = {timerId: 0,message: props.message, isVis: props.isVis, success: props.success, alertId: props.alertId}
    }

    formatName(inUser) {
        if (inUser.userId > 0)
        return <h1>Hello, {inUser.userName}!</h1>
        else return <h1>Create or load a User</h1>
    }

    componentDidUpdate() {
       if (this.state.alertId !== this.props.alertId)
            this.setState({
                message: this.props.message,
                isVis: this.props.isVis,
                success: this.props.success,
                alertId: this.props.alertId

            },() => {
                this.timerID = setInterval(
                    () => this.tick(), 3000
                )}
            )
    }

    tick() {
        this.setState({
            isVis: false,
        })
        clearTimeout(this.timerID)
    }

    render() {
        return (
            <div className={`alert success-${this.props.success} ${this.state.isVis ? 'alert-shown' : 'alert-hidden'}`}>
        <strong>{this.props.message}</strong>
            </div>
        )
    }
}

export default Alert