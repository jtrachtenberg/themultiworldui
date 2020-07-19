import React from 'react';

class Title extends React.Component {
    constructor(props) {
        super(props)
        this.user = props.inUser
    }

    formatName() {
        if (this.user.userName.length > 0)
        return <h1>Hello, {this.user.userName}!</h1>
        else return <h1>Create a User</h1>
    }
      
    handleName = (inUser) => {
        this.setState({
            user: inUser
        })
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <div>{this.formatName(this.user)}</div>
        )
    }
}

export default Title