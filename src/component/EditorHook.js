import React, { useState, useEffect, useRef } from 'react';
import * as editorForms from './editor/editorForms'
import {fetchData} from './utils/fetchData'

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
}

export const EditorHook = ({inUser, inSpace, inPlace, updateHandler}) => {
    const [spaces, loadSpaces] = useState([])
    const [editSpace, setCurrentSpace] = useState({})
    const prevUserId = usePrevious(inUser.userId)
    const prevSpaceId = usePrevious(inSpace.spaceId)

    useEffect(() => {
        if (!editSpace || (!Object.keys(editSpace).length === 0 && editSpace.constructor === Object)) return //empty
        const shouldUpdate = editSpace.spaceId && (editSpace.spaceId !== prevSpaceId) ? true : (typeof(editSpace.failed) === 'number' || typeof(editSpace.failed) === 'boolean') ? true : false
        if (shouldUpdate) {
            updateHandler(editSpace, 'space')
            setCurrentSpace(Object.create({}))
        }
        
    },[editSpace, prevSpaceId, inSpace, updateHandler])

    useEffect(() => {
        const postData = { userId: inUser.userId}

        if (inUser.userId && (inUser.userId !== prevUserId)) {
            fetchData('loadSpaces', postData).then(response => loadSpaces(response)).catch(e=>console.log(e))
        }
    },[inUser, prevUserId])

    useEffect(() => {
        if (!spaces) return
        if (Array.isArray(spaces) && spaces.length === 0) return
        setCurrentSpace(spaces[0])
    }, [spaces])

    if (inUser && inUser.userId > 0)
        return (
            <div>
                <editorForms.ObjectCreatorForm userId={inUser.userId} spaces={spaces} />
                <editorForms.CreateSpaceForm userId={inUser.userId} inSpaceId={inSpace.spaceId} spaceHandler={newSpace => updateHandler(newSpace, 'space')} />
                <editorForms.UpdateSpaceForm userId={inUser.userId} spaces={spaces} spaceHandler={newSpace => {
                    updateHandler(newSpace, 'space')
                }} />
                <editorForms.CreatePlaceForm userId={inUser.userId} inPlace={inPlace} spaces={spaces} placeHandler={newPlace => {
                    updateHandler(newPlace, 'place')
                }} />
                <editorForms.UpdatePlaceForm userId={inUser.userId} spaces={spaces} inPlace={inPlace} placeHandler={newPlace => {
                    updateHandler(newPlace, 'place')
                }} />
            </div>
        )
    else
        return (
            <div></div>
        )
}