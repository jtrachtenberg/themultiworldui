import React from 'react'
import {KeyHandler} from './utils/keyHandler'
import {UpdatePlaceFormHook} from './editor/UpdatePlaceFormHook'
import {Place} from './utils/defaultObjects'
import {ReactComponent as GetIcon} from './GetObject.svg';
import {updateHandler} from './utils/formUtils'
import TooltipPopover from './utils/TooltipPopover'
import Portal from './utils/Portal'
import Cli from './Cli'

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          place: this.props.inPlace,
          images: [],
          objectImages: [],
          npcImages: [],
          showToolTip: false,
          showImage: false,
          alt: "",
          src: "",
          coords: null,
          toolTipText: "",
          toolTipId: "",
          playing: true,
          editMode: false,
          overClass: "none"
        }
        this.toolTip = React.createRef()
        this.toolTipText = ""
    }  

    componentDidUpdate() {      
      let images = []
      let objectImages = []
      if (Array.isArray(this.props.inPlace.images)) images = Array.from(this.props.inPlace.images)
      if (Array.isArray(this.props.inPlace.objects))
        this.props.inPlace.objects.forEach((object,i) => {
          if (Array.isArray(object.images) && object.images.length > 0) {
            object.images = object.images.filter(o => o !== null && typeof o !== 'undefined')
            object.images[0].objectId = object.objectId
            object.images[0].description = object.description
            objectImages = [...objectImages,...object.images]
          }
        })
      
      if (JSON.stringify(this.state.images) !== JSON.stringify(images))
        this.setState({images:images})

      if (JSON.stringify(this.state.objectImages) !== JSON.stringify(objectImages))
        this.setState({objectImages:objectImages})
    }

    handleImgClick = (e) => {
      const {alt, src} = e.target
      this.setState({
        showImage: true,
        alt: alt,
        src: src
      })
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

    getObjectClick = (e) => {
      const objectId = e.currentTarget.id
      const place = this.props.inPlace
      const objects = place.objects
      const object = objects.find(obj => Number(obj.objectId) === Number(objectId))
      const newObjects = objects.filter(obj => Number(obj.objectId) !== Number(objectId))
      place.objects = newObjects
      const user = this.props.inUser
      const inventory = user.stateData.inventory||[]
      inventory.push(object)
      user.stateData.inventory = inventory
      updateHandler('place',place,this.props.childUpdateHandler, true)
      this.props.updateUserHandler(user)
    }

    formatImage = (inImages,imgClass) => {
      inImages = inImages||this.state.images
      imgClass = imgClass||"none"
      const isObject = imgClass === 'object' ? true :false
      if (Array.isArray(inImages) && inImages.length > 0) {
        return inImages.map((image,i) => <div key={i} className={isObject ? "horizontalContainer" : "none"}><span className="imageContainer" key={i}><span><img onClick={this.handleImgClick} className={imgClass} id={`tooltip${i}`} onMouseEnter={isObject ? this.handleOnMouseOver : () => {}} onMouseLeave={isObject ? this.handleOnMouseOut : () => {}} alt={image.alt} description={isObject ? image.description : image.alt} src={image.src} /></span></span><span>{isObject && <span id={image.objectId} className="getObject" onClick={this.getObjectClick}><GetIcon onMouseEnter={this.handleOnMouseOver} onMouseLeave={this.handleOnMouseOut} description="Get Object" className="hoverMe"/></span>}</span></div>)
      }
     else {
        return <span></span>
      }
    }

    formatObjects = () => {
      const place = this.props.inPlace
      const vowelRegex = '^[aieouAIEOU].*'
      let retString = ""
      let objectsOnly = place.objects

      if (Array.isArray(objectsOnly) && objectsOnly.length > 0)
          objectsOnly = objectsOnly.filter(object => {
          if (typeof object === 'undefined' || object === null) return false
          if (typeof object.type === 'undefined') return true
          else if (object.type !== 'NPC') return true
          return false
        })

      if (Array.isArray(objectsOnly) && objectsOnly.length > 0) {

        retString = "You see "
        if (objectsOnly.length === 1) {
          retString += objectsOnly[0].title.split(" ")[0] === "A" ? "" : objectsOnly[0].title.split(" ")[0] === "An" ? "" : objectsOnly[0].title.match(vowelRegex) ? 'an' : 'a'
          retString += ` ${objectsOnly[0].title}`
        }
        else objectsOnly.forEach((object,i) => {
          let tmpString = (i > 0 && objectsOnly.length > 2) ? ", " : ""
          tmpString += (i === objectsOnly.length-1) ? " and " : ""

          tmpString += object.title.split(" ")[0] === "A" ? "" : object.title.split(" ")[0] === "An" ? "" : object.title.match(vowelRegex) ? 'an' : 'a'
          tmpString += ` ${object.title}`
          
          retString += tmpString
        })
        return <div>{retString}</div>
      }
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

    toggleEditMode = () => {
      this.setState({
        editMode: !this.state.editMode
      })
    }

    formatPlace = () => {
        const place = typeof(this.props.inPlace) === 'undefined' ? Place : this.props.inPlace
    return <div><h3>{this.props.isEdit && <span><button className="editButton" onClick={this.toggleEditMode}><img alt="edit" src="https://img.icons8.com/material-sharp/24/000000/edit.png"/></button>&nbsp;</span>}{place.title}</h3><span>{this.formatImage()}</span><p>{this.formatDescription(place)}</p><div>{this.formatObjects()}</div><div>{this.formatImage(this.state.objectImages,'object')}</div></div>
    }
    render() {
        return (
            <div>
              {this.state.showImage && <KeyHandler inKey={'Escape'} inKeyHandler={(keyPress)=>{this.setState({showImage: keyPress})}} />}
            <div className="place">{!this.state.editMode && this.formatPlace()}</div>
            <div>{this.state.editMode && <UpdatePlaceFormHook userId={this.props.inUser.userId} inPlace={this.props.inPlace} onSave={() => {this.setState({editMode: false})}} placeHandler={newPlace => {
                    this.props.childUpdateHandler(newPlace, 'place')
                }} />}</div>
            <div className="CliInput"><Cli audioResetHandler={this.props.audioResetHandler} messageResetHander={this.props.messageResetHander} inMsg={this.props.inMsg} inSnd={this.props.inSnd} inUser={this.props.inUser} inPlace={this.props.inPlace} updateUserHandler={this.props.updateUserHandler} childUpdateHandler={this.props.childUpdateHandler} socket={this.props.socket} isAdmin={this.props.isAdmin}/></div>
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
            {this.state.showImage && (
              <Portal id="imgPopOver">
                <div className="popOver" onClick={() => this.setState({showImage: false})}>
                  <img alt={this.state.alt} width="700" src={this.state.src.replace('w=200','w=700')} onClick={() => this.setState({showImage: false})} onMouseOut={() => this.setState({showImage: false})} />
                </div>
              </Portal>
            )}
            </div>
        )
    }
}
export default Main