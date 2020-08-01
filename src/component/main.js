import React from 'react'

class Main extends React.Component {
    constructor(props) {
        super(props)
        const place = {
            title: '',
            description: ''
        }
        this.state = {place: place}
    }  

    componentDidMount() {
        if (this.props.inUser && this.props.inUser.userId && this.props.inUser.userId > 0)
          this.loadPlace()
      }

    loadPlace = () => {
        const postUrl = "http://localhost:7555/loadPlace"
        console.log(this.props.inUser.stateData)
        const currentRoom = this.props.inUser.stateData.currentRoom
        const place = {
            placeId: currentRoom
          }
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