import React, { useState, useEffect } from 'react';
import {fetchData} from '../utils/fetchData'
import {ReactComponent as AddIcon} from '../addobject.svg';
import {updateHandler} from '../utils/formUtils'

export const ObjectsPaletteHook = ({userId, inPlace, placeHandler}) => {
    const [userObjects, editUserObjects] = useState([])
    useEffect(() => {
        async function doFetch() {
            const postData = {userId: userId}

            return await fetchData('loadUserObjects', postData)
        }
        
        doFetch()
        .then(response => {
            editUserObjects(response)
           
        })
    },[userId])

    const formatObjects = () => {
        return userObjects.map((object,i) => <div key={i}><h3>{object.title}<AddIcon onClick={()=> {
            const tmpObjects = (Array.isArray(inPlace.objects) && inPlace.objects.length > 0) ? [...inPlace.objects] : []
            tmpObjects.push(userObjects[i])

            const tmpPlace= Object.assign(inPlace)
            tmpPlace.objects=tmpObjects
            updateHandler('place',tmpPlace,placeHandler)
        }} /></h3></div>)
    }
    return (
        <div>
            {userObjects.length > 0 && formatObjects()}
        </div>
    )
}