import React from 'react'
import {Place} from './utils/defaultObjects'

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {place: this.props.inPlace}
    }  

    componentDidMount() {
          this.loadPlace()
      }

    componentDidUpdate() {
      let currentRoom = (this.props.inUser.userId > 0 ? this.props.inUser.stateData.currentRoom : 0)
      const oldRoom = typeof(this.props.inPlace) === 'undefined' ? 0 : this.props.inPlace.placeId
      if (Number(oldRoom) !== Number(currentRoom)) {
        this.loadPlace()
      }
    }

    loadPlace = async () => {
        const postUrl = "http://localhost:7555/loadPlace"
        const currentRoom = (this.props.inUser.userId > 0 ? this.props.inUser.stateData.currentRoom : 0)
        const tmpPlace = {placeId: currentRoom}
 
        await fetch(postUrl, {
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
    
    formatPlace = () => {
        const place = typeof(this.props.inPlace) === 'undefined' ? Place : this.props.inPlace
        return <div><h3>{place.title}</h3><p>{place.description}</p></div>
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