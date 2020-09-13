import React, { useState, useEffect, useRef } from 'react';
import * as editorForms from './editor/editorForms'
import {fetchData} from './utils/fetchData'
import {S3Uploader} from './S3Uploader'

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
}

export const EditorHook = ({isEdit, inUser, inSpace, inPlace, updateHandler}) => {
    const [spaces, loadSpaces] = useState([])
    const [places, editPlaces] = useState([])
    const [editSpace, setCurrentSpace] = useState({})
    const [updateTrigger, setUpdateTrigger] = useState(false)
    const prevUserId = usePrevious(inUser.userId)
    const prevSpaceId = usePrevious(inSpace.spaceId)

    useEffect(() => {
        if (prevSpaceId === 0 && inSpace.spaceId > 0) {
            setCurrentSpace(inSpace)
        } else {
            if (!editSpace || (!Object.keys(editSpace).length === 0 && editSpace.constructor === Object)) return //empty
                const shouldUpdate = editSpace.spaceId && (editSpace.spaceId !== prevSpaceId) ? true : (typeof(editSpace.failed) === 'number' || typeof(editSpace.failed) === 'boolean') ? true : false
            if (shouldUpdate) {
                updateHandler(editSpace, 'space')
                setCurrentSpace(Object.create({}))
            }
        }
        
    },[editSpace, prevSpaceId, inSpace, updateHandler])

    useEffect(() => {
        async function doFetch() {
            const postData = { userId: inUser.userId }

            return await fetchData('loadSpaces', postData)
        }
        if (inUser.userId > 0 && (inUser.userId !== prevUserId)) {
       
            doFetch().then(response => {
                    if (response.length === 0)
                        response = []
                    loadSpaces(response)
                })
                .catch(e=>console.log(e))
        } else if (inUser.userId === 0) loadSpaces([])
    },[inUser, prevUserId])

    useEffect(() => {
        if (typeof spaces === 'undefined') loadSpaces([])
        else if (Array.isArray(spaces) && spaces.length === 0) return
        setCurrentSpace(spaces[0])
    }, [spaces])

    const objectHandler = (response) => {
        setUpdateTrigger(!updateTrigger)
    }
    
    if (inUser && inUser.userId > 0)
        return (
            <div>
                <S3Uploader userId={inUser.userId} />
                <editorForms.CreateObjectForm userId={inUser.userId} objectHandler={objectHandler} />
                <editorForms.ObjectsPaletteHook updateTrigger={updateTrigger} userId={inUser.userId} inPlace={inPlace} objectHandler={objectHandler} placeHandler={newPlace => {
                    updateHandler(newPlace, 'place')
                }}/>
                <editorForms.CreateSpaceForm spaces={spaces} userId={inUser.userId} inSpaceId={inSpace.spaceId} spaceHandler={newSpace => {
                    const tmpSpace = Array.from(spaces)
                    tmpSpace.push(newSpace)
                    loadSpaces(tmpSpace)
                    updateHandler(newSpace, 'space')}} />
                <editorForms.UpdateSpaceForm userId={inUser.userId} spaces={spaces} spaceHandler={newSpace => {
                    updateHandler(newSpace, 'space')
                }} />
                <editorForms.CreatePlaceForm userId={inUser.userId} inPlace={inPlace} spaces={spaces} places={places} placeHandler={newPlace => {
                    updateHandler(newPlace, 'place')
                }} />
                { isEdit && 
                <editorForms.UpdatePlaceForm userId={inUser.userId} spaces={spaces} inPlace={inPlace} places={places} editPlaces={editPlaces} placeHandler={newPlace => {
                    updateHandler(newPlace, 'place')
                }} />
                }
            </div>
        )
    else
        return (
            <div></div>
        )
}