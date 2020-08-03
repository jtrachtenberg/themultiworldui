import React from 'react';
import './App.css';
//import Alert from './Alert.js'
//import CreateSpaceForm from './CreateSpaceForm.js'
//import LoadSpacesForm from './LoadSpacesForm'
import * as editorForms from './editor/editorForms'

class Editor extends React.Component {

    constructor(props) {
        super(props)
        this.state = {userSpaces: null, space: {spaceId:0,title:'',description:'',isRoot:0}, user: props.inUser, place: {placeId:0,title:'',description:'',isRoot:0}, alertMessage: "", alertVis: false, alertSuccess: true, spaces: null}
    }  

    componentDidMount() {
      if (this.props.inUser && this.props.inUser.userId && this.props.inUser.userId > 0)
        this.loadSpaces()
    }
    componentDidUpdate() {
        if (this.props.inUser.userId > 0 && this.props.spaces === null)
          this.loadSpaces()
        var inUser = this.state.user
        if (inUser.userId !== this.props.inUser.userId)
            this.setState({
                user: this.props.inUser
            })
    }

    loadSpace = (inSpaceId) => {
      console.log(this.state.spaces)
      console.log(typeof(inSpaceId))
      console.log(typeof(this.state.spaces[0].spaceId))
      const newSpace = this.state.spaces.find( ({ spaceId }) => spaceId === inSpaceId )
      console.log(newSpace)
      this.setState({
        space: newSpace
      })
    }

loadSpaces = () => {
  console.log('load spaces')
  const postUrl = "http://localhost:7555/loadSpaces"
  const postData = { userId: this.props.inUser.userId}
  if (this.props.inUser.userId > 0)
  fetch(postUrl, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData)
  }).then(response => response.json())
  .then (response => {
    console.log(response)
    this.setState({
      spaces: response
    })
  })
}

placeHandler = (place) => {
  let postUrl
  if (place.placeId === 0)
    postUrl = "http://localhost:7555/addPlace"
  else
    postUrl = "http://localhost:7555/updatePlace"

  console.log(postUrl)
}

spaceHandler = (space) => {
  let postUrl
  if (space.spaceId === 0)
    postUrl = "http://localhost:7555/addSpace"
  else
    postUrl = "http://localhost:7555/updateSpace"
console.log(postUrl)
  fetch(postUrl, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(space)
  })
  .then(response => response.json())
  .then(response => {
    space = response
    console.log(space)
    this.setState ({
        space: space
    })
  })
}   
    render() {
        return (
            <div>
                <editorForms.LoadSpacesForm inUser={this.state.user} inSpace={this.state.space} spaces={this.state.spaces} loadSpace={this.loadSpace}/>
                <editorForms.CreateSpaceForm inUser={this.state.user} inSpace={this.state.space} spaceHandler={this.spaceHandler}/>
                <editorForms.CreatePlaceForm inUser={this.state.user} inSpace={this.state.space} inPlace={this.state.place} placeHandler={this.placeHandler}/>
            </div>
        )
    }

}
export default Editor