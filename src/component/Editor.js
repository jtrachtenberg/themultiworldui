import React from 'react';
import './App.css';
import * as editorForms from './editor/editorForms'
import * as Constants from './constants'

class Editor extends React.Component {

  constructor(props) {
      super(props)
      this.state = {userSpaces: null, space: this.props.inSpace, user: props.inUser, place: this.props.inPlace, alertMessage: "", alertVis: false, alertSuccess: true, spaces: null}
  }  

  componentDidMount() {
    if (this.props.inUser && this.props.inUser.userId && this.props.inUser.userId > 0)
      this.loadSpaces()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    /*Object.entries(this.props).forEach(([key, val]) =>
     prevProps[key] !== val && console.log(`Prop '${key}' changed`)
    );*/
      if (this.props.inUser.userId > 0 && (this.state.spaces === null || typeof(this.state.spaces) === 'undefined') ) {
        this.loadSpaces()
      }

      var inUser = this.props.inUser
      if (inUser.userId !== this.props.inUser.userId)
          this.setState({
              user: this.props.inUser
          })
      var inPlace = this.props.inPlace
      if (inPlace !== this.state.place) {
          this.setState({
              place: this.props.inPlace
          })  
      }
  }

  loadSpace = (inSpaceId) => {
    const newSpace = this.state.spaces.find( ({ spaceId }) => spaceId === inSpaceId )
    this.setState({
      space: newSpace
    }, this.props.childUpdateHandler(newSpace,'space'))
  }

  loadSpaces = () => {
    console.log('loadSpaces')
    console.log(this.props.inUser.userId)
    const postUrl = `${Constants.HOST_URL}:${Constants.EXPRESS_PORT}/loadSpaces`
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
    let message
    if (place.failed)
      message = `Update to ${place.title} failed.`
    else
      message = `${place.title} updated`
    console.log(message)
    this.setState({
      place: place
    }, this.props.childUpdateHandler(place,'place',message))
  }

  spaceHandler = (space) => {
    let message
    if (space.failed)
      message = `Update to ${space.title} failed.`
    else
      message = `${space.title} updated`
    this.setState({
      space: space
    }, () => {
      this.props.childUpdateHandler(space,'space',message)
      this.loadSpaces()
    })
  }   

  modalHandler = async () => {
    await this.props.childUpdateHandler("Unsplash","modalType")
    await this.props.childUpdateHandler(true,"showModal")
  }

  render() {
      return (
          <div>
              <editorForms.LoadSpacesForm inUser={this.props.inUser} inSpace={this.state.space} spaces={this.state.spaces} loadSpace={this.loadSpace}/>
              <editorForms.CreateSpaceForm inUser={this.props.inUser} inSpace={this.state.space} spaceHandler={this.spaceHandler}/>
              <editorForms.CreatePlaceForm inUser={this.props.inUser} inSpace={this.state.space} inPlace={this.state.place} placeHandler={this.placeHandler}/>
              <editorForms.UpdatePlaceForm inUser={this.props.inUser} inSpace={this.state.space} inPlace={this.state.place} placeHandler={this.placeHandler} modalHandler={this.modalHandler} modalClose={this.props.modalClose} modalReturn={this.props.modalReturn}/>
          </div>
      )
  }

}
export default Editor