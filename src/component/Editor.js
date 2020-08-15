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
    console.log(inSpaceId)
    console.log(this.state.spaces)
    const newSpace = this.state.spaces.find( ({ spaceId }) => spaceId === inSpaceId )
    this.setState({
      space: newSpace
    }, this.props.childUpdateHandler(newSpace,'space'))
  }

  loadSpaces = () => {
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
    this.props.childUpdateHandler(place,'place',message)
    /*this.setState({
      place: place
    }, )*/
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
              <editorForms.LoadSpacesForm userId={this.props.inUser.userId} spaces={this.state.spaces} loadSpace={this.loadSpace}/>
              <editorForms.CreateSpaceForm userId={this.props.inUser.userId} inSpaceId={this.props.inSpace.spaceId} spaceHandler={this.spaceHandler}/>
              <editorForms.UpdateSpaceForm userId={this.props.inUser.userId} inSpace={this.props.inSpace} spaceHandler={this.spaceHandler} />
              <editorForms.CreatePlaceForm inPlace={this.props.inPlace} spaceId={this.props.inSpace.spaceId} inUser={this.props.inUser} placeHandler={this.placeHandler} />
              <editorForms.UpdatePlaceForm inUser={this.props.inUser} inSpace={this.state.space} inPlace={this.state.place} placeHandler={this.placeHandler} modalHandler={this.modalHandler} modalClose={this.props.modalClose} modalReturn={this.props.modalReturn}/>
          </div>
      )
  }

}
export default Editor