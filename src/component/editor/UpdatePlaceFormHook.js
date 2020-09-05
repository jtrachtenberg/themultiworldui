import React, { useState, useEffect, useRef } from 'react';
import { setFormHeader, updateHandler } from '../utils/formUtils';
import {ReactComponent as DeleteIcon} from '../delete.svg';
import {ReactComponent as CreateIcon} from '../create.svg';
import {ReactComponent as AddIcon} from '../addkeyword.svg';
import {MediaSearch} from '../utils/MediaSearch';
import {PlaceSelector} from './PlaceSelector'

import {fetchData} from '../utils/fetchData'

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
}

export const UpdatePlaceFormHook = ({ userId, inPlace, spaces, placeHandler}) => {
    const [isVis, toggleIsVis] = useState(true)
    const [spaceId, setSpaceId] = useState(inPlace.spaceId)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [isRoot, toggleIsRoot] = useState(false)
    const [direction, setDirection] = useState("")
    const [modalReturn, setModalReturn] = useState({})
    const [disabled, setDisabled] = useState(false)
    const [places, setPlaces] = useState([])
    const [exits, setExits] = useState([])
    const [exitSelect, setExitSelect] = useState(-1)
    const [poi, editPoi] = useState([])
    const [images, editImages] = useState([])
    const [audio, editAudio] = useState([])
    const [showNewPoi, toggleNewPoi] = useState(false)
    const [newKeyword, setNewKeyword] = useState("")
    const [fetching, setFetching] = useState(false)
    const [isPrivate, setIsPrivate] = useState(false)
    const prevSpaceId = usePrevious(spaceId)

    useEffect(() => {
        if (Array.isArray(spaces) && spaces.length > 0) {
            setSpaceId(spaces[0].spaceId)
        }
    },[spaces])

    useEffect(() => {
        if (spaceId > 0 && spaceId !== prevSpaceId) loadPlaces(spaceId)
    })

    const loadPlaces = async (inSpaceId) => {
        inSpaceId = inSpaceId||spaceId
        if (!fetching) {
        setFetching(true)
        const postData = {spaceId: inSpaceId, userId: userId}
        await fetchData('loadPlaces', postData)
        .then(response => {
            setPlaces(response)
            setFetching(false)
        })
        .catch(e => console.log(e))
        }
    }

    useEffect(() => {
        if (typeof(inPlace.title) !== 'undefined') setTitle(inPlace.title)
        if (typeof(inPlace.description) !== 'undefined') setDescription(inPlace.description)
        typeof(inPlace.isRoot) === 'number' || typeof(inPlace.isRoot) === 'boolean' ? toggleIsRoot(inPlace.isRoot) : toggleIsRoot(false)
        typeof(inPlace.authType) === 'number' ? setIsPrivate(inPlace.authType) : setIsPrivate(false)

        editPoi(inPlace.poi)
        editImages(inPlace.images)
        editAudio(inPlace.audio)
        if (Array.isArray(inPlace.exits) && inPlace.exits.length>0) {
        let exitsArray = []
        inPlace.exits.forEach(exit => {
            for (const [key,value] of Object.entries(exit)) {
               const exitObj = {
                   name: key,
                   title: value.title,
                   placeId: value.placeId
               }
               exitsArray.push(exitObj)
            }
           })

        setExits(exitsArray)
        }
        if (Array.isArray(spaces) && spaces.length > 0)
            setSpaceId(inPlace.spaceId)

    },[inPlace, spaces, prevSpaceId])

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
        place.authType = isPrivate
        place.spaceId = spaceId

        let currentExits = []
        exits.forEach((value,i) => {
            currentExits.push({[value.name]:{title:value.title,placeId:value.placeId}})
        })

        if (exitSelect > 0) {
            const exit = places.find((element) => {
                return Number(element.placeId) === Number(exitSelect)
            })

            const title = exit.title
            const cmd = direction||title.split(" ")[0]

            currentExits.push({[cmd]:{title:title,placeId:exitSelect}})
        }
        place.exits = currentExits
        if (Array.isArray(poi) && poi.length > 0) place.poi = poi
        else place.poi = []
        if (Array.isArray(images) && images.length > 0) place.images = images
        else place.images = []
        if (Array.isArray(audio) && audio.length > 0) place.audio = audio
        else place.audio = []

        if (modalReturn && typeof(modalReturn.alt) === 'string') place.images.push({alt: modalReturn.alt, src: modalReturn.src, id: modalReturn.id, apilink: modalReturn.apilink})
        if (modalReturn && typeof(modalReturn.externalUrl) === 'string') place.audio.push({name: modalReturn.name, description: modalReturn.description, src: modalReturn.src, externalId: modalReturn.externalId, externalUrl: modalReturn.externalUrl, userName: modalReturn.userName})

        updateHandler("place", place, placeHandler)
        setDisabled(false)
        setModalReturn({})
        setDirection("")
        editPoi(place.poi)
        editImages(place.images)
        editAudio(place.audio)
        let exitsArray = []
        place.exits.forEach(exit => {
            for (const [key,value] of Object.entries(exit)) {
               const exitObj = {
                   name: key,
                   title: value.title,
                   placeId: value.placeId
               }
               exitsArray.push(exitObj)
            }
           })

        setExits(exitsArray)
        setExitSelect(-1)
    }

    const formatPoi = () => {
        if (Array.isArray(poi))
        return poi.map((value,i) => {
        return <section key={i}><label><DeleteIcon onClick={(e) => editPoi(() => {
            const poiCopy = [...poi]
            poiCopy.splice(i,1)
            editPoi(poiCopy)
            })} />Keyword: {value.word}</label>
        <input id={value.word} name={value.word} type="text" value={poi.find(word => word.word === value.word).description} 
        onChange={(e) => {
            const {id, value} = e.target
            
            editPoi(prevState => {
                const poi = prevState[prevState.findIndex((obj => obj.word === id))]
                poi.description = value
                prevState[prevState.findIndex((obj => obj.word === id))] = poi
              return [...prevState]
            })
            if (value.length === 0) setDisabled(true)
            else setDisabled(false)
        }} />
            
        </section>
        }
        ) 
    }



    const formatExits = () => {
        if (Array.isArray(exits) && exits.length > 0) {

        return exits.map((value,i) => {
            return <section key={i}><label><DeleteIcon onClick={(e) => setExits(() => {
                const exitsCopy = [...exits]
                exitsCopy.splice(i,1)
                setExits(exitsCopy)
                })} />Exit: {value.name}<input id={value.name} name={value.name} type="text" value={exits.find(exit => exit.placeId === value.placeId).name||""} 
                onChange={(e) => {
                    const {id, value} = e.target
                    
                    setExits(prevState => {
                      prevState[id].name = value
                      return [...prevState]
                    })
                    if (value.length === 0) setDisabled(true)
                    else setDisabled(false)
                }} /></label>
                <div className="display-block">
                    <input id={i} name="title" type="text" value={exits.find(exit => exit.placeId === value.placeId).title||""}  onChange={(e) => {
                    const {id, value} = e.target
                    
                    setExits(prevState => {
                      prevState[id].title = value
                      return [...prevState]
                    })
                }} />
                </div>
            
                
            </section>
            }
            )
        } else return <div></div>
    }

    if (userId && inPlace && inPlace.placeId)
            return (
                <div>
                <div>{setFormHeader("Update Place", () => toggleIsVis(!isVis))}</div>
                
                <form className={isVis ? "n" : "invis"} onSubmit={handleSubmit}>
                <MediaSearch modalReturn={modalReturn} images={images} handleImages={setModalReturn} editImages={editImages} audio={audio} editAudio={editAudio} handleAudio={setModalReturn} />
                <section>
                <label>Title
                    <input name="title" type="text" value={title||""} onChange={(e) => setTitle(e.target.value)} />
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
                <label>
                Is Private?:
                <input
                    name="isPrivate"
                    type="checkbox" 
                    value={isPrivate}
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(!isPrivate)} />
                </label>
                </section>
                {formatExits()}
                <section>
                <label>Add an Exit?</label>
                <PlaceSelector userId={userId} inSpaceId={spaceId} spaces={spaces} defaultSpaceId={inPlace.spaceId} setSpaceId={setSpaceId} loadPlaces={loadPlaces} places={places} name="addExit" value={exitSelect} setPlace={setExitSelect} skipPlaceId={inPlace.placeId}/>
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
                </div>
            )
    else
        return(<div></div>)
}