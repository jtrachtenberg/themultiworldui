import React, { useState, useEffect } from 'react';
import { setFormHeader } from '../utils/formUtils';

export const SpaceSelect = ({userId, inSpaceId, spaces, setCurrentSpace, loadPlaces}) => {
    const [spaceId, setSpaceId] = useState(inSpaceId)

    useEffect(() => {
        if (spaceId) setCurrentSpace(spaceId)
    }, [spaceId, setCurrentSpace]) // Only re-run the effect if spaceId changes

    const formatSpaces = () => {
        return spaces.map((value,i) => <option key={i} value={value.spaceId}>{value.title}</option>)
    }

    if (userId && Array.isArray(spaces))
        return (
            <div>
                <div>{setFormHeader("Select a space")}</div>
                    <select value={spaceId} onChange={(e) => {
                        setSpaceId(Number(e.target.value))
                        loadPlaces(e.target.value)
                        }}>
                        <option value="" disabled>Select a Space</option>
                        {formatSpaces()}
                    </select>
            </div>
        )
    else if (userId)
        return (
            <div>
                <div>{setFormHeader("No spaces created.")}</div>
            </div>
        )
    else
        return (
            <div></div>
        )

}