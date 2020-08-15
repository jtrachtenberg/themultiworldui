import React, { useState, useEffect } from 'react';
import { setFormHeader, updateHandler } from '../utils/formUtils';
import {Modal} from '../utils/Modal'
import Portal from '../utils/Portal'
import Unsplash from './Unsplash'
import {ReactComponent as ImageSearchIcon} from '../imagesearch.svg';
import * as Constants from '../constants'

export const UpdatePlaceFormHook = ({inUser, inPlace, spaceId, placeHandler}) => {
    const [isVis, toggleIsVis] = useState(true)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [isRoot, toggleIsRoot] = useState(false)
    const [direction, setDirection] = useState("")
    const [showModal, toggleShowModal] = useState(false)
    const [modalReturn, setModalReturn] = useState({})
    const [disabled, setDisabled] = useState(false)
    const [places, setPlaces] = useState([])
    const [exitSelect, setExitSelect] = useState(-1)
    const [poi, editPoi] = useState([])
   
    useEffect(() => {
        const loadPlaces = () => {
            const postUrl = `${Constants.HOST_URL}:${Constants.EXPRESS_PORT}/loadPlaces`
            const postData = {spaceId: spaceId}
        
            fetch(postUrl, {
                method: "POST",
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData)
            }).then(response => response.json())
            .then (response => {  
                setPlaces(response)
            })
        }
        if (spaceId > 0 ) loadPlaces(spaceId)
    },[spaceId])

    useEffect(() => {
        setTitle(inPlace.title)
        setDescription(inPlace.description)
        typeof(inPlace.isRoot) === 'number' ? toggleIsRoot(inPlace.isRoot) : toggleIsRoot(false)
        editPoi(inPlace.poi)
    },[inPlace])

    

    const hideModal = (e) => {
        e = e||{}
        toggleShowModal(false)
        setModalReturn(e)
        console.log(e)
    };
    

    const handleSubmit = (e) => {
        const place = Object.assign(inPlace)
        e.preventDefault();


        if (disabled) {
            return
        }
        setDisabled(true)

        place.title = title
        place.description = description
        place.isRoot = isRoot
        place.spaceId = spaceId

        if (exitSelect > 0) {
            const exit = places.find((element) => {
                return Number(element.placeId) === Number(exitSelect)
            })

            const title = exit.title
            const cmd = direction||title.split(" ")[0]

            place.exits.push({[cmd]:{title:title,placeId:exitSelect}})
        }

        if (modalReturn) place.modalReturn = modalReturn
        if (poi) place.poi = poi
        updateHandler("place", place, placeHandler)
        setDisabled(false)
        setModalReturn({})

    }

    const formatPoi = () => {
        console.log(poi)
        if (Array.isArray(poi))
        return poi.map((value,i) => {
            console.log(value)
        return <section key={i}><label>Keyword {value.word}</label>
        <input id={i} name={value.word} type="text" value={poi.find(word => word.word === value.word).description} 
        onChange={(e) => {
            const {id, value} = e.target
            
            editPoi(prevState => {
              //oldPoi = prevState.find(word => word.word === value)
              prevState[id].description = value
              console.log(prevState)
              return [...prevState]
            })//[...prevState,{[id]:newValue}])
        }} />
            
        </section>
        }
        ) 
        else console.log('not an array?')
    }

    const formatPlaces = () => {
        if (Array.isArray(places))
        return places.map((value,i) => Number(value.placeId) === Number(inPlace.placeId) ? "" : <option key={i} value={value.placeId}>{value.title}</option>)
    }

    if (inUser.userId && inPlace && inPlace.placeId)
            return (
                <div>
                <div>{setFormHeader("Update Place", () => toggleIsVis(!isVis))}</div>
                
                <form className={isVis ? "n" : "invis"} onSubmit={handleSubmit}>
                <section>
                    <span>Add Image <ImageSearchIcon onClick={() => toggleShowModal(true)}/></span>
                    {modalReturn && <div><img alt={modalReturn.alt} src={modalReturn.src} width="75"/></div>}
                </section>
                <section>
                <label>Title
                    <input name="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </label>
                <label>Description:
                    <textarea name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </label>              
                <label>
                Is Root?:
                <input
                    name="isRoot"
                    type="checkbox" 
                    value={isRoot}
                    checked={isRoot}
                    onChange={(e) => toggleIsRoot(!isRoot)} />
                </label>
                </section>
                <section>
                <label>Add an Exit?</label>
                <select name="addExit" defaultValue="-1" onChange={(e) => setExitSelect(Number(e.nativeEvent.target.value))} >
                     <option value="-1" disabled>Select a Place to exit</option>
                     {formatPlaces()}
                 </select>
                 <label>Direction for Exit?</label>
                 <input name="direction" value={direction} type="text" onChange={(e) => setDirection(e.target.value)} />
                </section>
                <section>
                    {formatPoi()}
                </section>
                <section className="saveButton">
                <button onClick={handleSubmit} disabled={disabled}>{disabled ? 'Updating' : 'Save'}</button>
                </section>
                </form>
                {showModal && (
                    <Portal>
                        <Modal handleClose={hideModal} show={showModal}
                        >
                        <Unsplash modalClose={hideModal}/>
                        </Modal>
                    </Portal>
                )}
                </div>
            )
    else
        return(<div></div>)
}