import React from 'react'
import {setFormHeader,toggleIsVis} from './utils/formUtils'
import {fetchData} from './utils/fetchData'
import {EXIT_NO_IMAGE} from './constants'

class Exits extends React.Component {
    constructor(props) {
        super(props)
        this.state = {vis: true, exits: [], inExits: []}
    }

    componentDidUpdate(prevUpdate) {
        if (this.props.inPlace.placeId === 0) return
  
       // if (prevUpdate.inPlace && prevUpdate.inPlace.exits && prevUpdate.inPlace.exits !== this.props.inPlace.exits) {
           if (this.state.inExits !== this.props.inPlace.exits) {
            if (Array.isArray(this.props.inPlace.exits)) {
            const postData = this.props.inPlace.exits.map(exit => {
                 // eslint-disable-next-line
                 for (const [key, value] of Object.entries(exit)) {
                   return Object.assign({placeId: Number(value.placeId)})
                 }
                 return {}
            })
            
            fetchData('loadImages',{inObj:postData}).then(response => {
                
                const exits = this.props.inPlace.exits
                let exitsArray=[]
        
                exits.forEach((exit,i) => {
                 for (const [key,value] of Object.entries(exit)) {
                    let imageData = response.find(item => item !== null && Number(item.placeId) === Number(value.placeId) )
                    if (typeof imageData === 'undefined') imageData = {}
                    const exitObj = {
                        name: key,
                        title: value.title,
                        placeId: value.placeId,
                        clicked: false,
                        src: typeof imageData.src !== 'undefined' ? imageData.src : EXIT_NO_IMAGE,
                        alt: typeof imageData.alt !== 'undefined' ? imageData.alt : "exit"
                    }
  
                    exitsArray.push(exitObj)
                 }
                })
                this.setState({exits: exitsArray, inExits: this.props.inPlace.exits})
                })
            }
        }
    }

    handleHeaderClick = (e) => {
        this.setState(toggleIsVis(this.state))
    }

    formatExits = () => {
        if (typeof(this.props.inPlace) === 'undefined' || this.props.inPlace.exits === null || !Array.isArray(this.state.exits)) return <div></div>
        
        return this.state.exits.map((exit,i) => <li className="clickable" key={exit.placeId} onClick={() => {exit.clicked = true;const tmpExits = this.state.exits;tmpExits[i]=exit;this.setState({exits: tmpExits});let timer = setTimeout(() => {this.doExit(exit.placeId);clearTimeout(timer);},150);}}><span className="imageContainer"><img className={exit.clicked ? "clicked" : "done"} alt={exit.alt} src={exit.src} /> </span><span className="imageContainer">{exit.name}</span></li>)
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
            <div><ul>{this.state.vis && this.formatExits()}</ul></div>
            </div>
        )
    }
}

export default Exits
