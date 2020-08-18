import React, { useState, useEffect } from 'react';
import { setFormHeader, updateHandler } from '../utils/formUtils';
import {Modal} from '../utils/Modal'
import Portal from '../utils/Portal'
import Unsplash from './Unsplash'
import {ReactComponent as ImageSearchIcon} from '../imagesearch.svg';
import {ReactComponent as DeleteIcon} from '../delete.svg';
import {ReactComponent as CreateIcon} from '../create.svg';
import {ReactComponent as AddIcon} from '../addkeyword.svg';


import {fetchData} from '../utils/fetchData'
import {SpaceSelect} from './SpaceSelect'

export const UpdatePlaceFormHook = ({userId, inPlace, spaces, placeHandler}) => {
    const [isVis, toggleIsVis] = useState(true)
    const [spaceId, setSpaceId] = useState(inPlace.spaceId)
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
    const [images, editImages] = useState([])
    const [showNewPoi, toggleNewPoi] = useState(false)
    const [newKeyword, setNewKeyword] = useState("")

    useEffect(() => {
        if (Array.isArray(spaces) && spaces.length > 0)
            setSpaceId(spaces[0].spaceId)
    },[spaces])

    useEffect(() => {
        const loadPlaces = () => {
            fetchData('loadPlaces', {spaceId: spaceId})
            .then(response => setPlaces(response))
            .catch(e => console.log(e))
        }
        if (spaceId > 0 ) loadPlaces()
    },[spaceId])

    useEffect(() => {
        const loadPlaces = (inSpaceId) => {
            fetchData('loadPlaces', {spaceId: inSpaceId})
            .then(response => setPlaces(response))
            .catch(e => console.log(e))
        }
        if (typeof(inPlace.title) !== 'undefined') setTitle(inPlace.title)
        if (typeof(inPlace.description) !== 'undefined') setDescription(inPlace.description)
        typeof(inPlace.isRoot) === 'number' ? toggleIsRoot(inPlace.isRoot) : toggleIsRoot(false)
        editPoi(inPlace.poi)
        editImages(inPlace.images)
        if (Array.isArray(spaces) && spaces.length > 0)
            setSpaceId(inPlace.spaceId)
            loadPlaces(inPlace.spaceId)
    },[inPlace, spaces])

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

        if (Array.isArray(poi) && poi.length > 0) place.poi = poi
        else place.poi = []
        if (Array.isArray(images) && images.length > 0) place.images = images
        else place.images = []

        if (modalReturn && typeof(modalReturn.src) === 'string') place.images.push({alt: modalReturn.alt, src: modalReturn.src, id: modalReturn.id, apilink: modalReturn.apilink})
        updateHandler("place", place, placeHandler)
        setDisabled(false)
        setModalReturn({})
        setDirection("")
        editPoi(place.poi)
        editImages(place.images)

    }

    const formatPoi = () => {
        if (Array.isArray(poi))
        return poi.map((value,i) => {
        return <section key={i}><label><DeleteIcon onClick={(e) => editPoi(() => {
            const poiCopy = [...poi]
            poiCopy.splice(i,1)
            editPoi(poiCopy)
            })} />Keyword: {value.word}</label>
        <input id={i} name={value.word} type="text" value={poi.find(word => word.word === value.word).description} 
        onChange={(e) => {
            const {id, value} = e.target
            
            editPoi(prevState => {
              //oldPoi = prevState.find(word => word.word === value)
              prevState[id].description = value
              return [...prevState]
            })//[...prevState,{[id]:newValue}])
        }} />
            
        </section>
        }
        ) 
    }

    const formatPlaces = () => {
        if (Array.isArray(places))
        return places.map((value,i) => Number(value.placeId) === Number(inPlace.placeId) ? "" : <option key={i} value={value.placeId}>{value.title}</option>)
    }

    const formatImages = () => {
        if (Array.isArray(images) && images.length > 0)
        return images.map((value,i) => <span key={i} className="imageContainer"><img loading="lazy" alt={value.alt} src={value.src} width="75"/><span className="iconInset"><DeleteIcon onClick={(e) => editImages(() => {
            const imagesCopy = [...images]
            imagesCopy.splice(i,1)
            editImages(imagesCopy)
            })} /></span></span>)
        else return <div>No Images</div>
    }

    if (userId && inPlace && inPlace.placeId)
            return (
                <div>
                <div>{setFormHeader("Update Place", () => toggleIsVis(!isVis))}</div>
                
                <form className={isVis ? "n" : "invis"} onSubmit={handleSubmit}>
                <section>
                    <div className="display-block">
                    {formatImages()}
                    </div>
                    <span>Add Image <ImageSearchIcon onClick={() => toggleShowModal(true)}/></span>
                    {modalReturn && <div><img alt={modalReturn.alt} src={modalReturn.src} width="75"/></div>}
                </section>
                <section>
                <label>Title
                    <input name="title" type="text" value={title||""} onChange={(e) => setTitle(e.target.value)} />
                </label>
                <label>Description:
                    <textarea name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </label>
                <SpaceSelect userId={userId} inSpaceId={inPlace.spaceId} spaces={spaces} defaultSpaceId={inPlace.spaceId} setCurrentSpace={inSpaceId => setSpaceId(inSpaceId)}/>              
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
                <div>
                    <h3>Points of Interest<span className="clickable" onClick={() => toggleNewPoi(true)} ><AddIcon /></span></h3> 
                </div>
                {showNewPoi && (
                    <div>
                        <label>Keyword:</label>
                        <input name="newKeyword" value={newKeyword} onChange={(e) => setNewKeyword(e.target.value)} />
                        <button className="clickable" onClick={() => {
                            toggleNewPoi(false)
                            const tmpPoi = [...poi]
                            tmpPoi.push({word:newKeyword, description:'You see nothing special.'})
                            editPoi(tmpPoi)
                        }}><CreateIcon /></button>
                    </div>
                )}
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