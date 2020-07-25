import React from 'react';

class Title extends React.Component {
    constructor(props) {
        super(props)
        this.state = {user: props.inUser}
    }

    formatName(inUser) {
        if (inUser.userId > 0)
        return <h1>Hello, {inUser.userName}!</h1>
        else return <h1>Create or load a User</h1>
    }
      
    formatLogo(inUser) {
        if (inUser.userId > 0)
        return <img width="1280" alt="TheMultiWorld" src="./themultiworldanimfinal.gif" />
        else return <img width="1280" alt="TheMultiWorld" src="./themultiworld2.png" />
    }
    handleName = (inUser) => {
        this.setState({
            user: inUser
        })
    }

    componentDidUpdate() {
        var inUser = this.state.user
        if ((inUser.userId < 1 && this.props.inUser.userId > 0) || (this.props.inUser.userId < 1 && inUser.userId > 0))
            this.setState({
                user: this.props.inUser
            })
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <div>
            <div>{this.formatLogo(this.state.user)}</div>
            <div>{this.formatName(this.state.user)}</div>
            </div>
        )
    }
}

export default Title