import React from 'react'
import {Place} from './utils/defaultObjects'
import * as Constants from './constants'

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {place: this.props.inPlace}
    }  

    componentDidMount() {
          this.loadPlace()
      }

    componentDidUpdate() {
      let currentRoom = (this.props.inUser.userId > 0 ? this.props.inUser.stateData.currentRoom : Constants.DEFAULT_PLACE)
      const oldRoom = typeof(this.props.inPlace) === 'undefined' ? Constants.DEFAULT_PLACE : this.props.inPlace.placeId
      if (Number(oldRoom) !== Number(currentRoom)) {
        this.loadPlace()
      }
    }

    loadPlace = () => {
        const postUrl = `${Constants.HOST_URL}:${Constants.EXPRESS_PORT}/loadPlace`
        const currentRoom = (this.props.inUser.userId > 0 ? this.props.inUser.stateData.currentRoom : Constants.DEFAULT_PLACE)
        const tmpPlace = {placeId: currentRoom}
 
        fetch(postUrl, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(tmpPlace)
        })
        .then(response => response.json())
        .then(response => {
          this.props.childUpdateHandler(response[0],'place')
        })
      }
    
    formatImage = () => {
      if (Array.isArray(this.props.inPlace.images) && this.props.inPlace.images.length > 0) {
        return this.props.inPlace.images.map((image) => <span><img alt={image.alt} src={image.src} /></span>)
      }
      else if (this.props.inPlace && this.props.inPlace.src) {
        return <p><img alt={this.props.inPlace.alt} src={this.props.inPlace.src} /></p>
      } else {
        return <p></p>
      }
    }

    formatPlace = () => {
        const place = typeof(this.props.inPlace) === 'undefined' ? Place : this.props.inPlace
      return <div><h3>{place.title}</h3><p>{place.description}</p>{this.formatImage()}</div>
    }
    render() {
        return (
            <div>
            <div>{this.formatPlace()}</div>
            </div>
        )
    }
}
export default Main