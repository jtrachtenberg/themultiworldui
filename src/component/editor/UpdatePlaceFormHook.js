import React, { useState, useEffect } from 'react';
import { setFormHeader, updateHandler } from '../utils/formUtils';
import {ReactComponent as DeleteIcon} from '../delete.svg';
import {ReactComponent as CreateIcon} from '../create.svg';
import {ReactComponent as AddIcon} from '../addkeyword.svg';
import {MediaSearch} from '../utils/MediaSearch';
import {PlaceSelector} from './PlaceSelector'

/*function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
}*/
/**
 * 
 * @param {userId} bigint (Required) 
 * @param {inPlace} object (Required)
 * @param {placeHandler} function (Required)
 * @param {spaces} array (optional)
 * @param {places} array (optional)
 * @param {editPlaces} array (optional)
 * @param {onSave} function (optional)
 */
export const UpdatePlaceFormHook = ({ userId, inPlace, spaces, places, editPlaces, placeHandler, onSave}) => {
    const [isVis, toggleIsVis] = useState(true)
    const [spaceId, setSpaceId] = useState(inPlace.spaceId)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [isRoot, toggleIsRoot] = useState(false)
    const [direction, setDirection] = useState("")
    const [modalReturn, setModalReturn] = useState({})
    const [disabled, setDisabled] = useState(false)
    const [exits, setExits] = useState([])
    const [exitSelect, setExitSelect] = useState(-1)
    const [poi, editPoi] = useState([])
    const [images, editImages] = useState([])
    const [audio, editAudio] = useState([])
    const [showNewPoi, toggleNewPoi] = useState(false)
    const [newKeyword, setNewKeyword] = useState("")
    const [isPrivate, setIsPrivate] = useState(false)
    const [placeList, editPlaceList] = useState([])
    //const prevSpaceId = usePrevious(spaceId)

    useEffect(() => {
        if (Array.isArray(spaces) && spaces.length > 0) {
            setSpaceId(spaces[0].spaceId)
        }
    },[spaces])

    useEffect(() => {
        const initVars = (place) => {
            place=place||inPlace
            if (typeof(place.title) !== 'undefined') setTitle(place.title)
            if (typeof(place.description) !== 'undefined') setDescription(place.description)
            typeof(place.isRoot) === 'number' || typeof(place.isRoot) === 'boolean' ? toggleIsRoot(place.isRoot) : toggleIsRoot(false)
            typeof(place.authType) === 'number' ? setIsPrivate(place.authType) : setIsPrivate(false)
    
            editPoi(place.poi)
            editImages(place.images)
            editAudio(place.audio)
            if (Array.isArray(place.exits) && place.exits.length>0) {
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
            }
        }

        if (inPlace.placeId > 0) {
            initVars()
        }
    },[inPlace])

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
            const arraySearch = Array.isArray(places) ? places : placeList
            const exit = arraySearch.find((element) => {
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
        if (typeof onSave === 'function') onSave()
    }

    const formatPoi = () => {
        if (Array.isArray(poi))
        return poi.map((value,i) => {
        return <section key={i}><label><DeleteIcon onClick={(e) => editPoi(() => {
            const poiCopy = [...poi]
            poiCopy.splice(i,1)
            editPoi(poiCopy)
            })} />Keyword: {value.word}</label>
        <input className="editorInput" id={value.word} name={value.word} type="text" value={poi.find(word => word.word === value.word).description} 
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
                })} />Exit: {value.name}<input className="editorInput" id={value.name} name={value.name} type="text" value={exits.find(exit => exit.placeId === value.placeId).name||""} 
                onChange={(e) => {
                    const {id, value} = e.target
                    const index = exits.findIndex(item => item.name === id)
                    setExits(prevState => {
                      prevState[index].name = value
                      return [...prevState]
                    })
                    if (value.length === 0) setDisabled(true)
                    else setDisabled(false)
                }} /></label>
                <div className="display-block">
                    <input id={i} className="editorInput" name="title" type="text" value={exits.find(exit => exit.placeId === value.placeId).title||""}  onChange={(e) => {
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
                <div>
                    {setFormHeader("Update Place", () => {
                        if (typeof onSave !== 'function') toggleIsVis(!isVis)})
                    }
                </div>
                
                <form className={isVis ? "editorForm" : "invis"} onSubmit={handleSubmit}>
                <section>
                <label htmlFor="title">Title:</label>
                    <input className="editorInput" name="title" type="text" value={title||""} required={true}  onChange={(e) => setTitle(e.target.value)} />
                
                <label htmlFor="description">Description:</label>
                    <textarea className="placeDescription" name="description" value={description} required={true} onChange={(e) => setDescription(e.target.value)} />
                
                <MediaSearch modalReturn={modalReturn} images={images} handleImages={setModalReturn} editImages={editImages} audio={audio} editAudio={editAudio} handleAudio={setModalReturn} />
                <label className="checkBox" htmlFor="isRoot">Is Root?:</label>
                <input 
                    name="isRoot"
                    type="checkbox" 
                    value={isRoot}
                    checked={isRoot}
                    onChange={(e) => toggleIsRoot(!isRoot)} />
                <label className="checkBox" htmlFor="isPrivate">Is Private?:</label>
                <input 
                    name="isPrivate"
                    type="checkbox" 
                    value={isPrivate}
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(!isPrivate)} />
                </section>
                {formatExits()}
                <section>
                <label>Add an Exit?</label>
                <PlaceSelector useTitle={false} userId={userId} inSpaceId={spaceId} spaces={spaces} defaultSpaceId={inPlace.spaceId} setSpaceId={setSpaceId} places={places} editPlaces={typeof editPlaces === 'function' ? editPlaces : editPlaceList} name="addExit" value={exitSelect} setPlace={setExitSelect} skipPlaceId={inPlace.placeId}/>
                 <label>Direction for Exit?</label>
                 <input className="editorInput" name="direction" value={direction} type="text" onChange={(e) => setDirection(e.target.value)} />
                </section>
                <section>
                <div>
                    <h3>Points of Interest<span className="clickable" onClick={() => toggleNewPoi(true)} ><AddIcon /></span></h3> 
                </div>
                {showNewPoi && (
                    <div>
                        <label htmlFor="newKeyword">Keyword:</label>
                        <input className="editorInput" name="newKeyword" value={newKeyword} onChange={(e) => setNewKeyword(e.target.value)} />
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
                <button onClick={handleSubmit} disabled={disabled}>{disabled ? 'Updating' : 'Update'}</button>
                {typeof onSave === 'function' && <button onClick={onSave}>Cancel</button>}
                </section>
                </form>
                </div>
            )
    else
        return(<div></div>)
}