import React from 'react'
import {setFormHeader,toggleIsVis} from './utils/formUtils'
import {fetchData} from './utils/fetchData'
import {EXIT_NO_IMAGE} from './constants'

class Exits extends React.Component {
    constructor(props) {
        super(props)
        this.state = {vis: true, images: []}
    }
    
    componentDidUpdate(prevUpdate) {
        if (prevUpdate.inPlace && prevUpdate.inPlace.placeId !== this.props.inPlace.placeId) {
            if (Array.isArray(this.props.inPlace.exits)) {
            const postData = this.props.inPlace.exits.map(exit => {
                 // eslint-disable-next-line
                 for (const [key, value] of Object.entries(exit)) {
                   return Object.assign({placeId: Number(value.placeId)})
                 }
                 return {}
            })
            
            console.log(postData)
            fetchData('loadImages',{inObj:postData}).then(response => this.setState({images: response}))
            }
        }
    }

    handleHeaderClick = (e) => {
        this.setState(toggleIsVis(this.state))
    }

    formatExits = () => {
        if (typeof(this.props.inPlace) === 'undefined' || this.props.inPlace.exits === null || !Array.isArray(this.props.inPlace.exits)) return <div></div>
        const exits = this.props.inPlace.exits
        let exitsArray=[]

        exits.forEach((exit,i) => {
         for (const [key,value] of Object.entries(exit)) {
            const exitObj = {
                name: key,
                title: value.title,
                placeId: value.placeId
            }
            if (this.state.images[i] !== null && typeof this.state.images[i] !== 'undefined') {
                if (this.state.images[i].src) exitObj.src = this.state.images[i].src
                if (this.state.images[i].alt) exitObj.alt = this.state.images[i].alt
            }
            exitsArray.push(exitObj)
         }
        })

    return exitsArray.map((exit,i) => <li className="clickable" key={exit.placeId} onClick={() => this.doExit(exit.placeId)}><span className="imageContainer">{typeof exit.src !== 'undefined' ? <img alt={exit.alt} src={exit.src} /> : <img alt="exit" src={EXIT_NO_IMAGE} />}</span>{exit.name} - {exit.title}</li>)
    }

    doExit = (inPlaceId) => {
        const newUser = Object.assign(this.props.inUser)
        newUser.stateData.newRoom = inPlaceId
        this.props.updateUserHandler(newUser)
    }
    render() {
        return (
            <div>
            <div>{setFormHeader("Exits", this.handleHeaderClick)}</div>
            <div><ul>{this.formatExits()}</ul></div>
            </div>
        )
    }
}

export default Exits
