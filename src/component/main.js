import React from 'react'
import {Place} from './utils/defaultObjects'

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {place: Place}
    }  

    componentDidMount() {
      console.log('didMount')
          this.loadPlace()
      }

    componentDidUpdate() {
      console.log('didUpdate')
      console.log(this.props.inUser)
      let currentRoom = (this.props.inUser.userId > 0 ? this.props.inUser.stateData.currentRoom : 0)
      if (Number(this.state.place.placeId) !== Number(currentRoom))
        this.loadPlace()
    }
    loadPlace = () => {
        const postUrl = "http://localhost:7555/loadPlace"
        console.log(this.props.inUser.stateData)
        const currentRoom = (this.props.inUser.userId > 0 ? this.props.inUser.stateData.currentRoom : 0)
        const place = Place
        place.placeId = currentRoom
 
        fetch(postUrl, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(place)
        })
        .then(response => response.json())
        .then(response => {
          this.setState({
            place: response[0]
          },() => {
              console.log(this.state.place)
          })
        })
      }
    
    formatPlace = () => {
        return <div><h3>{this.state.place.title}</h3><p>{this.state.place.description}</p></div>
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