import React from 'react'
import {Place} from './utils/defaultObjects'
import * as Constants from './constants'
//import {Tooltip} from './utils/Tooltip'
import TooltipPopover from './utils/TooltipPopover'
import Portal from './utils/Portal'

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          place: this.props.inPlace,
          showToolTip: false,
          coords: null,
          toolTipText: "",
          toolTipId: "",
        }
        this.toolTip = React.createRef()
        this.toolTipText = ""
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

    modalReturn = (retObj) => {
      this.setState({showToolTip: false}, console.log(this.state.showToolTip))
    }
    handleOnMouseOut = (e) => {
      console.log('mouseout')
      this.setState({showToolTip: false})
    }

    handleOnMouseOver= (e) => {
      const el = e.currentTarget
      const rect = el.getBoundingClientRect();
      const coords = {
        left: rect.x + rect.width / 2, // add half the width of the button for centering
        top: rect.y + window.scrollY // add scrollY offset, as soon as getBountingClientRect takes on screen coords
      }
      this.setState({
        showToolTip: true,
        coords: coords,
        toolTipText: e.currentTarget.alt,
        toolTipId: e.currentTarget.id
      })
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
        return this.props.inPlace.images.map((image,i) => <span className="imageContainer" key={i}><img id={`tooltip${i}`} onMouseEnter={this.handleOnMouseOver} onMouseLeave={this.handleOnMouseOut} alt={image.alt} src={image.src} /></span>)
      }
      else if (this.props.inPlace && this.props.inPlace.src) {
        
        return <p><img onMouseEnter={this.handleOnMouseOver} onMouseLeave={this.handleOnMouseOut} alt={this.props.inPlace.alt} src={this.props.inPlace.src} /></p>
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
            {this.state.showToolTip && (
              <Portal>
                <TooltipPopover
                  coords={this.state.coords} 
                >
                  <div>
                    {this.state.toolTipText}
                  </div>
                </TooltipPopover>
              </Portal>
            )}
            </div>
        )
    }
}
export default Main