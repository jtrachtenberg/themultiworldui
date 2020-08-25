import React, { useState, useEffect } from 'react'
import {fetchData} from '../utils/fetchData'
import {ReactComponent as AddIcon} from '../addobject.svg'
import {ReactComponent as DelIcon} from '../delete.svg'

import {updateHandler} from '../utils/formUtils'
import {ObjectUpdateFormHook} from './ObjectUpdateFormHook'

export const ObjectsPaletteHook = ({updateTrigger, userId, inPlace, placeHandler, objectHandler}) => {
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
    },[userId, updateTrigger])

    const formatObjects = () => {
        return userObjects.map((object,i) => <div key={i}><h4><DelIcon onClick={() => {
            fetchData("deleteObject",{objectId: object.objectId}).then(response => objectHandler(response))
        }}/><ObjectUpdateFormHook inObject={object} userId={userId} objectHandler={objectHandler} /><AddIcon onClick={()=> {
            const tmpObjects = (Array.isArray(inPlace.objects) && inPlace.objects.length > 0) ? [...inPlace.objects] : []
            tmpObjects.push(userObjects[i])

            const tmpPlace= Object.assign(inPlace)
            tmpPlace.objects=tmpObjects
            updateHandler('place',tmpPlace,placeHandler)
        }} />{object.title}</h4></div>)
    }
    return (
        <div>
            {userObjects.length > 0 && formatObjects()}
        </div>
    )
}