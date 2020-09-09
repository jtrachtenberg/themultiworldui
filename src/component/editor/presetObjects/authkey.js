import React, {useState, useEffect} from 'react';
import {PlaceSelector} from '../PlaceSelector'
import {fetchData} from '../../utils/fetchData'

export const AuthKey = ({editActionStack, actionStack, actionStackIndex, userId}) => {
    const [isGet, toggleIsGet] = useState(false)
    const [isDrop, toggleIsDrop] = useState(false)
    const [isGive, toggleIsGive] = useState(false)
    const [spaces, editSpaces] = useState([])
    const [spaceId, setSpaceId] = useState(0)
    const [keyPlace, setKeyPlace] = useState({})
    const [places, editPlaces] = useState([])

    useEffect(() => {

        async function loadSpaces () {
            const postData = { userId: userId }
            await fetchData('loadSpaces', postData)
            .then(response => {
                editSpaces(response)
                if (response.length>0)
                setSpaceId(response[0].spaceId)
            })
            .catch(e => console.log(e))
        }
        const initData = {
            isGet: isGet,
            isDrop: isDrop,
            isGive: isGive,
            command: 'authkey',
            authType: 'placeId',
            preset: 'authkey'
        }
        loadSpaces()
        const tmpArray = [...actionStack]
        const tmpAction = {...tmpArray[actionStackIndex],...initData}
        tmpArray[actionStackIndex] = tmpAction
        editActionStack(tmpArray)
        // eslint-disable-next-line react-hooks/exhaustive-deps   
    },[])

    useEffect(() => {

        async function loadPlaces (inSpaceId) {
            inSpaceId = inSpaceId||spaceId
            const postData = {spaceId: inSpaceId, userId: userId }
            await fetchData('loadPlaces', postData)
            .then(response => {
                editPlaces(response)
                if (response.length>1)
                inputUpdate(response[0].placeId)
            })
            .catch(e => console.log(e))
        }
        if (spaceId > 0) loadPlaces()
    // eslint-disable-next-line react-hooks/exhaustive-deps   
    }, [spaceId])

    const inputUpdate = (e,setFn) => {
        setFn=setFn||setKeyPlace
        let valueToUpdate, nameToUpdate
        if (typeof(e) === 'number') {
            valueToUpdate = e
            nameToUpdate='placeId'
        } else {
            const {checked, name, value, type} = e.target
            nameToUpdate = name
            valueToUpdate = type === 'checkbox' ? checked : value
        }
        setFn(valueToUpdate)

        //createPreset
        const tmpActions = (Array.isArray(actionStack) && actionStack.length > 0) ? [...actionStack] : []

        if ( typeof(tmpActions[actionStackIndex]) === 'undefined') tmpActions[actionStackIndex] = {}
        const inAction = Object.assign(tmpActions[actionStackIndex])
        inAction[nameToUpdate]=valueToUpdate
        tmpActions[actionStackIndex] = inAction
        editActionStack(tmpActions)
    }
    const addActionHandler = () => {
        return (
        <section>
             <PlaceSelector userId={userId} inSpaceId={spaceId} spaces={spaces} defaultSpaceId={spaceId} setSpaceId={setSpaceId} loadPlaces={() => {}} places={places} name="addKeyPlace" value={keyPlace} setPlace={inputUpdate} skipPlaceId={0}/>
             <label>
                Gettable?:
                <input
                    name="isGet"
                    type="checkbox" 
                    value={isGet}
                    checked={isGet}
                    onChange={(e) => inputUpdate(e,toggleIsGet)} />
                </label>
                <label>
                Dropable?:
                <input
                    name="isDrop"
                    type="checkbox" 
                    value={isDrop}
                    checked={isDrop}
                    onChange={(e) => inputUpdate(e,toggleIsDrop)} />
                </label>
                <label>
                Giveable?:
                <input
                    name="isGive"
                    type="checkbox" 
                    value={isGive}
                    checked={isGive}
                    onChange={(e) => inputUpdate(e,toggleIsGive)} />
                </label>
        </section>
        )
    }

    return (
        <div>{addActionHandler()}</div>
    )

}