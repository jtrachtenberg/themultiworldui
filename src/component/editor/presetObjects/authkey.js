import React, {useState, useEffect} from 'react';
import {PlaceSelector} from '../PlaceSelector'
import {fetchData} from '../../utils/fetchData'

export const AuthKey = ({editActionStack, handleActionChange, actionNumber, userId, spaces }) => {
    const [isGet, toggleIsGet] = useState(false)
    const [isDrop, toggleIsDrop] = useState(false)
    const [isGive, toggleIsGive] = useState(false)
    const [spaceId, setSpaceId] = useState(0)
    const [defaultSpaceId, setDefaultSpaceId] = useState(0)
    const [keyPlace, setKeyPlace] = useState({})
    const [places, editPlaces] = useState([])

    useEffect(() => {
        const initData = {
            isGet: isGet,
            isDrop: isDrop,
            isGive: isGive,
            command: 'authkey',
            authType: 'placeId',
            preset: 'authkey'
        }
        const tmpArray = []
        tmpArray[actionNumber]=initData
        editActionStack(tmpArray)
        // eslint-disable-next-line react-hooks/exhaustive-deps   
    },[])

    useEffect(() => {

        async function loadPlaces (inSpaceId) {
            inSpaceId = inSpaceId||spaceId
            const postData = {spaceId: inSpaceId}
            await fetchData('loadPlaces', postData)
            .then(response => {
                console.log(response)
                editPlaces(response)
                if (response.length>1)
                inputUpdate(response[0].placeId)
            })
            .catch(e => console.log(e))
        }
        loadPlaces()
    // eslint-disable-next-line react-hooks/exhaustive-deps   
    }, [spaceId])

    useEffect(() => {
        if (Array.isArray(spaces) && spaces.length > 0) {
            setSpaceId(spaces[0].spaceId)
            setDefaultSpaceId(spaces[0].spaceId)
        }
    },[spaces])

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
        handleActionChange(nameToUpdate,valueToUpdate,actionNumber)
    }
    const addActionHandler = () => {
        return (
        <section>
             <PlaceSelector userId={userId} inSpaceId={spaceId} spaces={spaces} defaultSpaceId={defaultSpaceId} setSpaceId={setSpaceId} loadPlaces={() => {}} places={places} name="addKeyPlace" value={keyPlace} setPlace={inputUpdate} skipPlaceId={0}/>
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