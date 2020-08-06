import React from 'react';
import './App.css';
import * as editorForms from './editor/editorForms'
import {Space} from './utils/defaultObjects'

class Editor extends React.Component {

  constructor(props) {
      super(props)
      this.state = {userSpaces: null, space: Space, user: props.inUser, place: {placeId:0,title:'',description:'',isRoot:0}, alertMessage: "", alertVis: false, alertSuccess: true, spaces: null}
  }  

  componentDidMount() {
    if (this.props.inUser && this.props.inUser.userId && this.props.inUser.userId > 0)
      this.loadSpaces()
  }

  componentDidUpdate() {
      if (this.props.inUser.userId > 0 && (this.state.spaces === null || typeof(this.state.spaces) === 'undefined') ) {
        console.log('loadSpaces')
        this.loadSpaces()
      }

      var inUser = this.props.inUser
      if (inUser.userId !== this.props.inUser.userId)
          this.setState({
              user: this.props.inUser
          })
  }

  loadSpace = (inSpaceId) => {
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
    const user = this.props.inUser
    user.stateData.currentRoom = place.placeId
    user.stateData.currentSpace = place.spaceId
    this.props.userHandler(user)
    this.setState({
      place: place
    })
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
              <editorForms.LoadSpacesForm inUser={this.props.inUser} inSpace={this.state.space} spaces={this.state.spaces} loadSpace={this.loadSpace}/>
              <editorForms.CreateSpaceForm inUser={this.props.inUser} inSpace={this.state.space} spaceHandler={this.spaceHandler}/>
              <editorForms.CreatePlaceForm inUser={this.props.inUser} inSpace={this.state.space} inPlace={this.state.place} placeHandler={this.placeHandler}/>
          </div>
      )
  }

}
export default Editor