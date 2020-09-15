import React, { useState, useEffect } from 'react';
import { setFormHeader } from '../utils/formUtils';

export const SpaceSelect = ({useTitle, userId, inSpaceId, spaces, setCurrentSpace, loadPlaces}) => {
    const [spaceId, setSpaceId] = useState(inSpaceId)

    useEffect(() => {
        if (Array.isArray(spaces) && spaces.length > 0 && (Object.keys(spaces).length > 0 && spaces.constructor === Object)) setSpaceId(spaces[0].spaceId)
    },[spaces])

    useEffect(() => {
        if (spaceId) setCurrentSpace(spaceId)
    }, [spaceId, setCurrentSpace]) // Only re-run the effect if spaceId changes

    const formatSpaces = () => {
        return spaces.map((value,i) => Object.keys(value).length === 0 ? <span></span> : <option key={i} value={value.spaceId}>{value.title}</option>)
    }

    if (userId && Array.isArray(spaces))
        return (
            <div>
                <div>{useTitle && setFormHeader("Select a space")}</div>
                    <select value={spaceId} onChange={(e) => {
                        setSpaceId(Number(e.target.value))
                        if (typeof loadPlaces === 'function') loadPlaces(e.target.value)
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