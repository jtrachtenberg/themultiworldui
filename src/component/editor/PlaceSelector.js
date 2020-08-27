import React from 'react';
import {SpaceSelect} from './SpaceSelect'

export const PlaceSelector = ({ places, name, value, setPlace, skipPlaceId, userId, inSpaceId, spaces, defaultSpaceId, setSpaceId, loadPlaces }) => {

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