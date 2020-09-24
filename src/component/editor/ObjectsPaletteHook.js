import React, { useState, useEffect } from 'react'
import {fetchData} from '../utils/fetchData'
import {ReactComponent as AddIcon} from '../addobject.svg'
import {ReactComponent as DelIcon} from '../delete.svg'

import {updateHandler} from '../utils/formUtils'
import {UpdateObjectForm} from './UpdateObjectForm'

export const ObjectsPaletteHook = ({updateTrigger, userId, inPlace, placeHandler, objectHandler}) => {
    const [userObjects, editUserObjects] = useState([])

    useEffect(() => {
        async function doFetch() {
            const postData = {userId: userId }

            return await fetchData('loadUserObjects', postData)
        }
        
        doFetch()
        .then(response => {
            response.forEach( (item,i) => {
                if (typeof item.actionStack === 'string') {
                    item.actionStack = JSON.parse(item.actionStack)
                    response[i] = item
                }
            })
            editUserObjects(response)
           
        })
    },[userId, updateTrigger])

    const formatObjects = () => {
        return userObjects.map((object,i) => <div key={i}><h4><DelIcon onClick={() => {
            fetchData("deleteObject",{objectId: object.objectId}).then(response => objectHandler(response))
        }}/><UpdateObjectForm object={object} userId={userId} objectHandler={objectHandler} /><AddIcon onClick={()=> {
            const tmpObjects = (Array.isArray(inPlace.objects) && inPlace.objects.length > 0) ? [...inPlace.objects] : []
            if (Array.isArray(object.actionStack)) {
                tmpObjects.push(userObjects[i])

                const tmpPlace= Object.assign(inPlace)
                tmpPlace.objects=tmpObjects
                updateHandler('place',tmpPlace,placeHandler)
            } else {
                if (object.actionStack.type === 'NPC') {
                    object.isRoot = 0
                    const postData = {...object}
                    postData.placeId = inPlace.placeId
                    fetchData('addObject',postData).then(response => {
                        console.log(response)
                        object.objectId=response[0]
                        object.type='NPC'
                        tmpObjects.push(object)
                        const tmpPlace= Object.assign(inPlace)
                        tmpPlace.objects=tmpObjects
                        console.log('tmpPlace',tmpPlace)
                        updateHandler('place',tmpPlace,placeHandler)
                    })

                }
            }
        }} />{object.title}</h4></div>)
    }
    return (
        <div>
            {userObjects.length > 0 && formatObjects()}
        </div>
    )
}