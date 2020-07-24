import React from 'react';
import './App.css';
//import Alert from './Alert.js'
import CreateSpaceForm from './CreateSpaceForm.js'

class Spaces extends React.Component {

    constructor(props) {
        super(props)
        this.state = {space: {spaceId:0,title:'',description:'',isRoot:0}, user: props.inUser, alertMessage: "", alertVis: false, alertSuccess: true}
    }  

    componentDidUpdate() {
        var inUser = this.state.user
        if (inUser.userId !== this.props.inUser.userId)
            this.setState({
                user: this.props.inUser
            })
    }

    passSpace = (space) => {

    }

    render() {
        return (
            <div>
                <CreateSpaceForm inUser={this.state.user} inSpace={this.state.space} />
            </div>
        )
    }

}
export default Spaces