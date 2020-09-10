import React, {useState, useEffect} from 'react';
import {SpaceSelect} from './SpaceSelect'
import {fetchData} from '../utils/fetchData'

export const PlaceSelector = ({ places, name, value, setPlace, editPlaces, skipPlaceId, userId, inSpaceId, spaces, defaultSpaceId, setSpaceId }) => {
    const [fetching, setFetching] = useState(false)

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
                editPlaces(response)
                setFetching(false)
            })
            .catch(e => console.log(e))
        }      
    }

    const formatPlaces = () => {
        if (Array.isArray(places))
        return places.map((value,i) => Number(value.placeId) === Number(skipPlaceId) ? "" : <option key={i} value={value.placeId}>{value.title}</option>)
    }

    return (
        <div>
        <section>
        <SpaceSelect userId={userId} inSpaceId={inSpaceId} spaces={spaces} defaultSpaceId={defaultSpaceId} setCurrentSpace={inSpaceId => setSpaceId(inSpaceId)} loadPlaces={loadPlaces} />
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