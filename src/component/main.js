import React from 'react'
import {Place} from './utils/defaultObjects'
import * as Constants from './constants'
//import {Tooltip} from './utils/Tooltip'
import TooltipPopover from './utils/TooltipPopover'
import Portal from './utils/Portal'
import {fetchData} from './utils/fetchData'

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          place: this.props.inPlace,
          images: [],
          showToolTip: false,
          coords: null,
          toolTipText: "",
          toolTipId: "",
        }
        this.toolTip = React.createRef()
        this.toolTipText = ""
    }  

    componentDidUpdate() {
      let currentRoom = (this.props.inUser.userId > 0 ? this.props.inUser.stateData.currentRoom : Constants.DEFAULT_PLACE)
      const oldRoom = typeof(this.props.inPlace) === 'undefined' ? Constants.DEFAULT_PLACE : this.props.inPlace.placeId
      if (Number(oldRoom) !== Number(currentRoom)) {
        this.loadPlace()
      }
      let images = []
      if (Array.isArray(this.props.inPlace.images)) images = [...this.props.inPlace.images]
      if (Array.isArray(this.props.inPlace.objects))
        this.props.inPlace.objects.forEach((object,i) => Array.isArray(object.images) ? images = [...images,...object.images] : 1)

      console.log('images!!!!')
      console.log(images)
      console.log(this.state.images)
      if (this.state.images.length !== images.length)
        this.setState({images:images})
    }

    handleOnMouseOut = (e) => {
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
        toolTipText: el.getAttribute(`description`),
        toolTipId: e.currentTarget.id
      })
    }

    loadPlace = async () => {

        const currentRoom = (this.props.inUser.userId > 0 ? this.props.inUser.stateData.currentRoom : Constants.DEFAULT_PLACE)
        const tmpPlace = {placeId: currentRoom}
        
        await fetchData('loadPlace',tmpPlace).then(response => {
            this.props.childUpdateHandler(response[0],'place')
        })
        
      }
    
    formatImage = () => {
      if (Array.isArray(this.state.images) && this.state.images.length > 0) {
        return this.state.images.map((image,i) => <span className="imageContainer" key={i}><img id={`tooltip${i}`} onMouseEnter={this.handleOnMouseOver} onMouseLeave={this.handleOnMouseOut} alt={image.alt} description={image.alt} src={image.src} /></span>)
      }
     else {
        return <span></span>
      }
    }

    formatObjects = () => {
      const place = this.props.inPlace
      const vowelRegex = '^[aieouAIEOU].*'
      let retString = ""
      if (Array.isArray(place.objects) && place.objects.length > 0) {
        retString = "You see "
        if (place.objects.length === 1) {
          retString += place.objects[0].title.split(" ")[0] === "A" ? "" : place.objects[0].title.split(" ")[0] === "An" ? "" : place.objects[0].title.match(vowelRegex) ? 'an' : 'a'
          retString += ` ${place.objects[0].title}`
        }
        else place.objects.forEach((object,i) => {
          let tmpString = (i > 0 && place.objects.length > 2) ? ", " : ""
          tmpString += (i === place.objects.length-1) ? " and " : ""

          tmpString += object.title.split(" ")[0] === "A" ? "" : object.title.split(" ")[0] === "An" ? "" : object.title.match(vowelRegex) ? 'an' : 'a'
          tmpString += ` ${object.title}`
          
          retString += tmpString
        })
        return <div>{retString}</div>
      }
        //return place.objects.map((object,i) => <div key={i}><p>You see {object.title.split(" ")[0] === "A" ? "" : object.title.split(" ")[0] === "An" ? "" : object.title.match(vowelRegex) ? 'an' : 'a'} {object.title} here.</p></div>)
      else
        return <div></div>
    }

    formatDescription = (place) => {
      if (!this.props.inPlace.poi || !Array.isArray(this.props.inPlace.poi)) return place.description
      const poi = this.props.inPlace.poi
      const words = place.description.split(" ")
      const regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
      
      return words.map((word,i) => {
      const keyword = poi.find(poi => word.replace(regex,'') === poi.word)
      if (typeof(keyword) !== 'undefined')
        return <span key={i}><span id={`${word}${i}`} description={keyword.description} className="keyword" onMouseEnter={this.handleOnMouseOver} onMouseLeave={this.handleOnMouseOut}>{word}</span><span>&nbsp;</span></span>
        else return <span key={i}>{word} </span>
      })
    }

    formatPlace = () => {
        const place = typeof(this.props.inPlace) === 'undefined' ? Place : this.props.inPlace
      return <div><h3>{place.title}</h3><p>{this.formatDescription(place)}</p><p>{this.formatImage()}</p></div>
    }
    render() {
        return (
            <div>
            <div>{this.formatPlace()}</div>
            <div>{this.formatObjects()}</div>
            {this.state.showToolTip && (
              <Portal id="toolTip">
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