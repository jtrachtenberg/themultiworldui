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
        console.log('passSpace')
        let postUrl
  
        postUrl = "http://localhost:7555/addSpace"
        fetch(postUrl, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(space)
          })
          .then(response => response.json())
          .then(response => {
          })
    }
    
    render() {
        return (
            <div>
                <CreateSpaceForm inUser={this.state.user} inSpace={this.state.space} spaceHandler={this.passSpace}/>
            </div>
        )
    }

}
export default Spaces