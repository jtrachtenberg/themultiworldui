import React, {useState, useEffect} from 'react';
import {SpaceSelect} from './SpaceSelect'
import {fetchData} from '../utils/fetchData'

export const PlaceSelector = ({ useTitle, places, name, value, setPlace, editPlaces, skipPlaceId, userId, inSpaceId, spaces, defaultSpaceId, setSpaceId }) => {
    const [fetching, setFetching] = useState(false)
    const [userSpaces, editUserSpaces] = useState([])
    const [userPlaces, editUserPlaces] = useState([])

    useEffect(() => {
        async function doFetch() {
            const postData = { userId: userId }

            return await fetchData('loadSpaces', postData)
        }
        if (typeof spaces === 'undefined') {
       
            doFetch().then(response => {
                if (response.length > 0) {
                    editUserSpaces(response)
                    setSpaceId(response[0])
                }
            })
            .catch(e=>console.log(e))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps   
    },[spaces])

    useEffect(() => {
        loadPlaces()
            // eslint-disable-next-line react-hooks/exhaustive-deps   
    },[inSpaceId])

    useEffect(() => {
        loadPlaces()
            // eslint-disable-next-line react-hooks/exhaustive-deps   
    },[skipPlaceId])

    const loadPlaces = async (spaceId) => {
        spaceId = spaceId||inSpaceId
        if (!fetching) {
            setFetching(true)
            const postData = {spaceId: spaceId}
            await fetchData('loadPlaces', postData)
            .then(response => {
                if (typeof(editPlaces) === 'function') editPlaces(response)
                editUserPlaces(response)
                setFetching(false)
            })
            .catch(e => console.log(e))
        }      
    }

    const formatPlaces = () => {
        const formatArray = (Array.isArray(places) ? places : userPlaces)
        
        return formatArray.map((value,i) => Number(value.placeId) === Number(skipPlaceId) ? "" : <option key={i} value={value.placeId}>{value.title}</option>)
    }

    return (
        <div>
        <section>
        <SpaceSelect useTitle={useTitle} userId={userId} inSpaceId={inSpaceId} spaces={typeof spaces === 'undefined' ? userSpaces : spaces} defaultSpaceId={defaultSpaceId} setCurrentSpace={inSpaceId => setSpaceId(inSpaceId)} loadPlaces={loadPlaces} />
        </section>
        <section>
            <div className="display-block">
            <select name={name} value={value} onChange={(e) => setPlace(Number(e.nativeEvent.target.value))}>
                     <option value="-1" disabled>Select a Place to exit</option>
                     {formatPlaces()}
            </select>
            </div>
        </section>
        </div>
    );
  };